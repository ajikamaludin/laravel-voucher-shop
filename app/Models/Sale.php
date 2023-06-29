<?php

namespace App\Models;

use App\Services\GeneralService;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class Sale extends Model
{
    const PAYED_WITH_MIDTRANS = 'midtrans';

    const PAYED_WITH_MANUAL = 'manual';

    const PAYED_WITH_DEPOSIT = 'deposit';

    const PAYED_WITH_PAYLATER = 'paylater';

    const PAYED_WITH_POIN = 'poin';

    protected $fillable = [
        'code',
        'customer_id',
        'date_time',
        'amount',
        'payed_with',
        'payment_token',
        'payment_status',
        'payment_response',
        'payment_channel',
        'payment_type',
    ];

    protected $appends = [
        'format_human_created_at',
        'format_created_at',
        'display_amount',
        'payment_with',
    ];

    protected static function booted(): void
    {
        static::creating(function (Sale $model) {
            if ($model->code == null) {
                $model->code = GeneralService::generateSaleVoucherCode();
            }
        });
    }

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
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

    public function displayAmount(): Attribute
    {
        return Attribute::make(get: function () {
            return 'Rp '.number_format($this->amount, is_float($this->amount) ? 2 : 0, ',', '.');
        });
    }

    public function paymentWith(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->payed_with != null) {
                return [
                    self::PAYED_WITH_DEPOSIT => 'Deposit',
                    self::PAYED_WITH_PAYLATER => 'Hutang',
                    self::PAYED_WITH_POIN => 'Penukaran Poin',
                ][$this->payed_with];
            }

            return '';
        });
    }

    public function create_notification()
    {
        if ($this->payed_with == self::PAYED_WITH_POIN) {
            Notification::create([
                'entity_type' => User::class,
                'description' => $this->customer->fullname.' melakukan penukaran '.$this->items()->count().' voucher sebesar '.$this->items->value('price').' poin',
            ]);

            Notification::create([
                'entity_id' => auth()->id(),
                'description' => 'Transaksi '.$this->code.' berhasil',
            ]);

            return;
        }

        Notification::create([
            'entity_type' => User::class,
            'description' => $this->customer->fullname.' melakukan pembelian '.$this->items()->count().' voucher sebesar '.$this->display_amount,
        ]);

        Notification::create([
            'entity_id' => auth()->id(),
            'description' => 'Transaksi pembelian anda '.$this->code.' sebesar '.$this->display_amount.' berhasil',
        ]);
    }

    public function create_payment()
    {
        // payed with deposit
        if ($this->payed_with == Sale::PAYED_WITH_DEPOSIT) {
            $deposit = $this->customer->deposites()->create([
                'credit' => $this->amount,
                'description' => $this->code,
                'related_type' => self::class,
                'related_id' => $this->id,
                'is_valid' => DepositHistory::STATUS_VALID,
            ]);
            $deposit->update_customer_balance();
        }

        // payed with paylater
        if ($this->payed_with == Sale::PAYED_WITH_PAYLATER) {
            $paylater = $this->customer->paylaterHistories()->create([
                'debit' => $this->amount,
                'description' => $this->code,
            ]);
            $paylater->update_customer_paylater();
        }
    }

    public function create_poin_reward()
    {
        $bonus = PoinReward::where('customer_level_id', $this->customer->customer_level_id)
            ->where('amount_buy', '<=', $this->amount)
            ->orderBy('bonus_poin', 'desc')
            ->first();

        if ($bonus != null) {
            $poin = $this->customer->poins()->create([
                'debit' => $bonus->bonus_poin,
                'description' => GeneralService::generateBonusPoinCode(),
                'narration' => 'Bonus Poin Reward',
            ]);

            $poin->update_customer_balance();
        }
    }

    public function create_poin_affilate()
    {
        $affilateEnabled = Setting::getByKey('AFFILATE_ENABLED');
        $isAllowAffilate = GeneralService::isAllowAffilate($this->customer->level->key);
        if ($affilateEnabled == 1 && $isAllowAffilate) {
            $bonus = Setting::getByKey('AFFILATE_DOWNLINE_POIN_AMOUNT');
            if ($bonus > 0) {
                $code = CustomerRefferal::where('refferal_id', $this->customer_id)->value('customer_code');
                $customer = Customer::where('referral_code', $code)->first();

                $poin = $customer->poins()->create([
                    'debit' => $bonus,
                    'description' => GeneralService::generateBonusPoinCode(),
                    'narration' => 'Bonus Poin Affilate (Downline)',
                ]);

                $poin->update_customer_balance();
            }
        }
    }
}
