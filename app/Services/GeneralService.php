<?php

namespace App\Services;

use App\Models\DepositHistory;
use App\Models\DepositLocation;
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
                    'display_name' => 'Setor Tunai di Kantor WBB',
                    'admin_fee' => 0
                ];
            }
        }

        return $payment;
    }

    public static function getCartEnablePayment()
    {
        // deposit
        // poin
        // paylater
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
        $code = DepositHistory::where('type', DepositHistory::TYPE_DEPOSIT)->count() + 1;

        return 'Invoice #DSR' . now()->format('dmy') . GeneralService::formatNumberCode($code);
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
