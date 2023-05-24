<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('coin_rewards', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->decimal('amount_buy', 20, 2)->default(0);
            $table->decimal('bonus_coin', 20, 2)->default(0);
            $table->ulid('customer_level_id')->nullable();

            $table->timestamps();
            $table->softDeletes();
            $table->ulid('created_by')->nullable();
            $table->ulid('updated_by')->nullable();
            $table->ulid('deleted_by')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coin_rewards');
    }
};
