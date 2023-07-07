<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\DepositHistory;
use App\Models\DepositLocation;
use App\Models\PaylaterHistory;
use App\Models\PoinHistory;
use App\Models\Sale;
use App\Models\Setting;
use Illuminate\Support\Carbon;

class GeneralService
{
    public static function script_parser($script)
    {
        $data = [];
        $lines = explode("\n", $script);

        foreach ($lines as $line) {
            $item = self::line_parser($line);
            if ($item != null) {
                $data[] = $item;
            }
        }

        return $data;
    }

    public static function line_parser($line)
    {
        $item = null;

        $commands = explode(' ', $line);
        foreach ($commands as $command) {
            if (str_contains($command, 'name')) {
                $d = explode('=', $command);
                $item['username'] = str_replace('"', '', $d[1]);
            }
            if (str_contains($command, 'password')) {
                $d = explode('=', $command);
                $item['password'] = str_replace('"', '', $d[1]);
            }
            if (str_contains($command, 'profile')) {
                $d = explode('=', $command);
                $item['profile'] = str_replace('"', '', $d[1]);
            }
            if (str_contains($command, 'comment')) {
                $d = explode('=', $command);
                $item['comment'] = str_replace('"', '', $d[1]);
            }
            if (str_contains($command, 'limit-bytes-total')) {
                $d = explode('=', $command);
                $item['quota'] = (int) str_replace('"', '', $d[1]);
            }
        }
        info('item', [$item]);

        return $item;
    }

    public static function getEnablePayment()
    {
        $payment = [];

        $midtrans_enable = Setting::getByKey('MIDTRANS_ENABLED');
        if ($midtrans_enable == 1) {
            $payment[] = [
                'name' => Setting::PAYMENT_MIDTRANS,
                'logo' => null, //asset(Setting::getByKey('MIDTRANS_LOGO')),
                'tagline' => '<p>(Verifikasi <b>Otomatis</b> tanpa upload bukti pembayaran)</p>',
                'display_name' => 'Payment Gateway',
                'admin_fee' => Setting::getByKey('MIDTRANS_ADMIN_FEE'),
                'open_hours' => '24 Jam / Non Stop',
            ];
        }

        $enable = Setting::getByKey('ENABLE_MANUAL_TRANSFER');
        if ($enable == 1) {
            $openHourForm = Setting::getByKey('MANUAL_TRANSFER_OPEN_HOUR');
            $closeHourForm = Setting::getByKey('MANUAL_TRANSFER_CLOSE_HOUR');
            $openHour = Carbon::createFromFormat('H:i', $openHourForm);
            $closeHour = Carbon::createFromFormat('H:i', $closeHourForm);
            if (now()->between($openHour, $closeHour)) {
                $payment[] = [
                    'name' => Setting::PAYMENT_MANUAL,
                    'logo' => null,
                    'tagline' => '<p>(Verifikasi <b>Manual</b> & upload bukti pembayaran)</p>',
                    'display_name' => 'Transfer Bank & E-Money',
                    'admin_fee' => Setting::getByKey('ADMINFEE_MANUAL_TRANSFER'),
                    'open_hours' => $openHourForm . ' - ' . $closeHourForm,
                ];
            }
        }

        $enable = Setting::getByKey('ENABLE_CASH_DEPOSIT');
        if ($enable == 1) {
            $locations = DepositLocation::all(); // 30 partner
            $enables = [];

            foreach ($locations as $location) {
                $openHour = Carbon::createFromFormat('H:i', $location->open_hour);
                $closeHour = Carbon::createFromFormat('H:i', $location->close_hour);
                $enables[] = now()->between($openHour, $closeHour);
            }

            if (in_array(true, $enables)) {
                $payment[] = [
                    'name' => Setting::PAYMENT_CASH_DEPOSIT,
                    'logo' => null,
                    'tagline' => '<p>(Verifikasi <b>Manual</b> & upload bukti pembayaran)</p>',
                    'display_name' => Setting::getByKey('TEXT_CASH_DEPOSIT'),
                    'admin_fee' => Setting::getByKey('ADMINFEE_CASH_DEPOSIT'),
                    'open_hours' => null,
                ];
            }
        }

        return $payment;
    }

    public static function getCartEnablePayment(Customer $customer, $total)
    {
        $payments = [];

        $payments[] = [
            'name' => Sale::PAYED_WITH_DEPOSIT,
            'display_name' => 'Bayar dengan saldo Deposit',
            'is_enable' => $customer->deposit_balance >= $total,
        ];

        if ($customer->is_allow_paylater) {
            $payments[] = [
                'name' => Sale::PAYED_WITH_PAYLATER,
                'display_name' => 'Bayar dengan saldo Hutang',
                'is_enable' => $customer->paylater_remain >= $total,
            ];
        }

        return $payments;
    }

    public static function parserToHour($time)
    {
        $r = '';
        $time = explode(':', $time);
        foreach ($time as $t) { //00 : 00
            if ($t < 10) {
                $r .= '0' . (int) $t . ':';
            } else {
                $r .= $t . ':';
            }
        }

        return substr($r, 0, -1);
    }

    public static function generatePaylaterTopupCode()
    {
        $code = PaylaterHistory::where('type', PaylaterHistory::TYPE_UPGRADE)
            ->whereDate('created_at', now())
            ->count() + 1;

        return 'Invoice #TLH' . now()->format('dmy') . GeneralService::formatNumberCode($code);
    }

    public static function generateDepositCode()
    {
        $code = DepositHistory::where('type', DepositHistory::TYPE_DEPOSIT)
            ->whereDate('created_at', now())
            ->count() + 1;

        return 'Invoice #DSR' . now()->format('dmy') . GeneralService::formatNumberCode($code);
    }

    public static function generateDepositRepayCode()
    {
        $code = DepositHistory::where('type', DepositHistory::TYPE_REPAYMENT)
            ->whereDate('created_at', now())
            ->count() + 1;

        return 'Invoice #PLH' . now()->format('dmy') . GeneralService::formatNumberCode($code);
    }

    public static function generateSaleVoucherCode()
    {
        $code = Sale::whereDate('created_at', '=', now())
            ->where('payed_with', '!=', Sale::PAYED_WITH_POIN)
            ->count() + 1;

        return 'Invoice #VCR' . now()->format('dmy') . GeneralService::formatNumberCode($code);
    }

    public static function generateBonusPoinCode()
    {
        $code = PoinHistory::whereDate('created_at', now())->count() + 1;

        return 'Invoice #BPN' . now()->format('dmy') . GeneralService::formatNumberCode($code);
    }

    public static function generateExchangePoinCode()
    {
        $code = Sale::whereDate('created_at', '=', now())
            ->where('payed_with', '=', Sale::PAYED_WITH_POIN)
            ->count() + 1;

        return 'Invoice #PVC' . now()->format('dmy') . GeneralService::formatNumberCode($code);
    }

    public static function formatNumberCode($number)
    {
        if ($number < 10) {
            return '000' . $number;
        }
        if ($number < 100) {
            return '00' . $number;
        }
        if ($number < 1000) {
            return '0' . $number;
        }

        return $number;
    }

    public static function isAllowAffilate($key)
    {
        $isAllow = false;
        $levels = json_decode(Setting::getByKey('AFFILATE_ALLOWED_LEVELS'));
        foreach ($levels as $level) {
            if ($key == $level->key) {
                $isAllow = true;
            }
        }

        return $isAllow;
    }
}
