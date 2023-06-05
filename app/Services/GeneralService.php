<?php

namespace App\Services;

use App\Models\Setting;

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
        $payment = [
            ['name' => Setting::PAYMENT_MANUAL, 'logo' => null, 'display_name' => 'Transfer Manual'],
        ];

        $midtrans_enable = Setting::getByKey('MIDTRANS_ENABLED');
        if ($midtrans_enable == 1) {
            $payment[] = ['name' => Setting::PAYMENT_MIDTRANS, 'logo' => asset(Setting::getByKey('MIDTRANS_LOGO'))];
        }

        return $payment;
    }

    public static function getCartEnablePayment()
    {
        // deposit
        // coin
        // paylater
    }
}
