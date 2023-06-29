<?php

namespace App\Services;

use Closure;
use function React\Async\async;
use React\EventLoop\Loop;

class AsyncService
{
    public static function async(Closure $closure, $isAsync = true)
    {
        info(self::class, [$closure]);
        if ($isAsync) {
            Loop::addTimer(0.1, async(function () use ($closure) {
                try {
                    $closure();
                } catch (\Exception $e) {
                    info(self::class, [
                        'message' => $e->getMessage(),
                        'error' => $e,
                    ]);
                }
            }));
        } else {
            $closure();
        }
    }
}
