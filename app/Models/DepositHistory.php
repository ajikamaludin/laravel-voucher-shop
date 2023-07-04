<?php

namespace App\Models;

use App\Events\NotificationEvent;
use App\Services\GeneralService;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class DepositHistory extends Model
{
    const STATUS_VALID = 0;

    const STATUS_WAIT_UPLOAD = 1;

    const STATUS_WAIT_APPROVE = 2;

    const STATUS_WAIT_PAYMENT = 3;

    const STATUS_INVALID = 4;

    const STATUS_REJECT = 5;

    const STATUS_EXPIRED = 6;

    const TYPE_DEPOSIT = 0;

    const TYPE_REPAYMENT = 1;

    protected $fillable = [
        'debit',
        'credit',
        'description',
        'note',
        'customer_id',
        'related_type',
        'related_id',
        'is_valid',
        'image_prove',
        'account_id',
        'deposit_location_id',
        'payment_token',
        'payment_status',
        'payment_response',
        'payment_channel',
        'payment_type',
        'type',
    ];

    protected $appends = [
        'status',
        'format_human_created_at',
        'format_created_at',
        'amount',
        'image_prove_url',
        'admin_fee',
    ];

    protected static function booted(): void
    {
        static::creating(function (DepositHistory $model) {
            if ($model->description == null) {
                if ($model->type == DepositHistory::TYPE_DEPOSIT) {
                    $model->description = GeneralService::generateDepositCode();
                }
            }
        });
    }

    public function status(): Attribute
    {
        return Attribute::make(get: function () {
            return [
                self::STATUS_VALID => ['text' => 'Success', 'color' => 'bg-green-600', 'text_color' => 'text-green-600'],
                self::STATUS_WAIT_UPLOAD => ['text' => 'Upload bukti bayar', 'color' => 'bg-red-600', 'text_color' => 'text-red-600'],
                self::STATUS_WAIT_APPROVE => ['text' => 'Menunggu Approve', 'color' => 'bg-green-600', 'text_color' => 'text-green-600'],
                self::STATUS_WAIT_PAYMENT => ['text' => 'Menunggu Pembayaran', 'color' => 'bg-green-600', 'text_color' => 'text-green-600'],
                self::STATUS_INVALID => ['text' => 'Error', 'color' => 'bg-red-600', 'text_color' => 'text-red-600'],
                self::STATUS_REJECT => ['text' => 'Reject', 'color' => 'bg-red-600', 'text_color' => 'text-red-600'],
                self::STATUS_EXPIRED => ['text' => 'Expired', 'color' => 'bg-red-600', 'text_color' => 'text-red-600'],
            ][$this->is_valid];
        });
    }

    public function formatHumanCreatedAt(): Attribute
    {
        return Attribute::make(get: function () {
            return Carbon::parse($this->created_at)->translatedFormat('d F Y');
        });
    }

    public function formatCreatedAt(): Attribute
    {
        return Attribute::make(get: function () {
            return Carbon::parse($this->created_at)->translatedFormat('d F Y H:i:s');
        });
    }

    public function amount(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->credit == 0) {
                return 'Rp '.number_format($this->debit, is_float($this->debit) ? 2 : 0, ',', '.');
            }

            return '-Rp '.number_format($this->credit, is_float($this->credit) ? 2 : 0, ',', '.');
        });
    }

    public function imageProveUrl(): Attribute
    {
        return Attribute::make(get: function () {
            return $this->image_prove == null ? '' : asset($this->image_prove);
        });
    }

    public function adminFee(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->account_id != null) {
                return Setting::getByKey('ADMINFEE_MANUAL_TRANSFER');
            }

            if ($this->deposit_location_id != null) {
                return Setting::getByKey('ADMINFEE_CASH_DEPOSIT');
            }

            if ($this->payment_token != null) {
                return Setting::getByKey('MIDTRANS_ADMIN_FEE');
            }
        });
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function depositLocation()
    {
        return $this->belongsTo(DepositLocation::class, 'deposit_location_id');
    }

    public function paylater()
    {
        return $this->hasOne(PaylaterHistory::class, 'id', 'related_id');
    }

    public function update_customer_balance()
    {
        $customer = Customer::find($this->customer_id);
        $customer->update(['deposit_balance' => $customer->deposit_balance + $this->debit - $this->credit]);
    }

    public function create_notification()
    {
        if ($this->type != self::TYPE_DEPOSIT) {
            return;
        }

        if ($this->payment_channel == Setting::PAYMENT_MANUAL) {
            $status = '';
            if ($this->is_valid == self::STATUS_WAIT_APPROVE) {
                $status = ' (bukti bayar di upload, membutuhkan konfirmasi)';
            }

            $notification = Notification::create([
                'entity_type' => User::class,
                'description' => $this->customer->fullname.' melakukan deposit transfer manual sebesar : '.$this->amount.$status,
                'url' => route('deposit.edit', $this),
                'type' => Notification::TYPE_DEPOSIT,
            ]);
        }

        if ($this->payment_channel == Setting::PAYMENT_CASH_DEPOSIT) {
            $status = '';
            if ($this->is_valid == self::STATUS_WAIT_APPROVE) {
                $status = ' (bukti bayar di upload, membutuhkan konfirmasi)';
            }

            $notification = Notification::create([
                'entity_type' => User::class,
                'description' => $this->customer->fullname.' melakukan deposit manual sebesar : '.$this->amount.$status,
                'url' => route('deposit.edit', $this),
                'type' => Notification::TYPE_DEPOSIT,
            ]);
        }

        if ($this->payment_channel == Setting::PAYMENT_MIDTRANS) {
            $notification = Notification::create([
                'entity_type' => User::class,
                'description' => $this->customer->fullname.' melakukan deposit via midtrans sebesar : '.$this->amount,
                'url' => route('deposit.edit', $this),
                'type' => Notification::TYPE_DEPOSIT,
            ]);
        }

        NotificationEvent::dispatch([
            'id' => $notification->id,
            'description' => $notification->description,
            'url' => $notification->url,
            'type' => Notification::TYPE_DEPOSIT,
            'format_created_at' => now()->translatedFormat('d F Y H:i:s'),
            'deposit_notifications' => Notification::where('entity_type', User::class)
                ->where('type', Notification::TYPE_DEPOSIT)
                ->where('is_read', Notification::UNREAD)->limit(10)
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function create_notification_repayment()
    {
        if ($this->type != self::TYPE_REPAYMENT) {
            return;
        }

        $notification = Notification::create([
            'entity_type' => User::class,
            'description' => $this->customer->fullname.' melakukan pembayaran hutang sebesar '.$this->amount,
            'url' => route('paylater.repay.edit', $this),
            'type' => Notification::TYPE_DEPOSIT,
        ]);

        NotificationEvent::dispatch([
            'id' => $notification->id,
            'description' => $notification->description,
            'url' => $notification->url,
            'type' => Notification::TYPE_DEPOSIT,
            'format_created_at' => now()->translatedFormat('d F Y H:i:s'),
            'deposit_notifications' => Notification::where('entity_type', User::class)
                ->where('type', Notification::TYPE_DEPOSIT)
                ->where('is_read', Notification::UNREAD)->limit(10)
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function create_notification_user()
    {
        Notification::create([
            'entity_id' => $this->customer_id,
            'description' => 'Deposit '.$this->description.' sebesar '.$this->amount.' sudah sukses diterima',
        ]);
    }
}
