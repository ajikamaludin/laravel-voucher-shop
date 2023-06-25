<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\DepositHistory;
use App\Models\DepositLocation;
use App\Models\Sale;
use App\Models\Setting;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

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
                'logo' => asset(Setting::getByKey('MIDTRANS_LOGO')),
                'display_name' => 'Midtrans',
                'admin_fee' => Setting::getByKey('MIDTRANS_ADMIN_FEE'),
            ];
        }

        $enable = Setting::getByKey('ENABLE_MANUAL_TRANSFER');
        if ($enable == 1) {
            $openHour = Carbon::createFromFormat('H:i', Setting::getByKey('MANUAL_TRANSFER_OPEN_HOUR'));
            $closeHour = Carbon::createFromFormat('H:i', Setting::getByKey('MANUAL_TRANSFER_CLOSE_HOUR'));
            if (now()->between($openHour, $closeHour)) {
                $payment[] = [
                    'name' => Setting::PAYMENT_MANUAL,
                    'logo' => null,
                    'display_name' => 'Transfer Manual',
                    'admin_fee' => 0
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
                    'display_name' => Setting::getByKey('TEXT_CASH_DEPOSIT'),
                    'admin_fee' => 0
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
            'is_enable' => $customer->deposit_balance >= $total
        ];

        if ($customer->is_allow_paylater) {
            $payments[] = [
                'name' => Sale::PAYED_WITH_PAYLATER,
                'display_name' => 'Bayar dengan saldo Hutang',
                'is_enable' => $customer->paylater_remain >= $total
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

    public static function generateDepositCode()
    {
        $code = DepositHistory::where('type', DepositHistory::TYPE_DEPOSIT)
            ->whereDate('created_at', now())
            ->count() + 1;

        return 'Invoice #DSR' . now()->format('dmy') . GeneralService::formatNumberCode($code);
    }

    public static function generateSaleVoucherCode()
    {
        $code = Sale::whereDate('created_at', now())->count() + 1;

        return 'Invoice #VCR' . now()->format('dmy') . GeneralService::formatNumberCode($code);
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
}
