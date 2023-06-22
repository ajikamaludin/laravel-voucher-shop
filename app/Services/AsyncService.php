<?php

namespace App\Services;

use Closure;
use function React\Async\async;
use React\EventLoop\Loop;

class AsyncService
{
    public static function async(Closure $closure, $isAsync = true)
    {
        info('async service', [$closure]);
        if ($isAsync) {
            Loop::addTimer(0.1, async(function () use ($closure) {
                $closure();
            }));
        } else {
            $closure();
        }
    }
}
