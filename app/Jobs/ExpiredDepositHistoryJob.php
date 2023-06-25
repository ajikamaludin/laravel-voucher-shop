<?php

namespace App\Jobs;

use App\Models\DepositHistory;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

// this check job run every 1 minute
class ExpiredDepositHistoryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        info(self::class, ['starting']);
        DB::beginTransaction();
        $maxTimeout = Setting::getByKey('MAX_MANUAL_TRANSFER_TIMEOUT');
        $expiredIds = [];
        $deposits = DepositHistory::whereIn('is_valid', [
            DepositHistory::STATUS_WAIT_UPLOAD,
            DepositHistory::STATUS_WAIT_APPROVE,
            DepositHistory::STATUS_WAIT_PAYMENT,
        ])
            ->get();

        info(self::class, ['deposit' => $deposits->count()]);
        foreach ($deposits as $deposit) {
            $lastUpdated = Carbon::parse($deposit->updated_at);

            // Calculate the difference between the last updated time and the current time
            $timeDifference = $lastUpdated->diffInHours(Carbon::now(), false);

            // Check if the time difference is more than 2 hours
            if ($timeDifference > $maxTimeout) {
                $expiredIds[] = $deposit->id;
            }
        }
        info(self::class, ['deposit_to_expired' => count($expiredIds)]);

        if (count($expiredIds) > 0) {
            DepositHistory::whereIn('id', $expiredIds)->update(['is_valid' => DepositHistory::STATUS_EXPIRED]);
        }

        DB::commit();
        info(self::class, ['done']);
    }
}
