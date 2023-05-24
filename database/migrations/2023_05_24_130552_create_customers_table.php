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
        Schema::create('customers', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->string('email')->nullable();
            $table->string('password')->nullable();
            $table->string('name')->nullable();
            $table->string('fullname')->nullable();
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('image')->nullable();
            $table->string('referral_code')->nullable();
            $table->string('google_id')->nullable();
            $table->decimal('deposit_balance', 20, 2)->default(0);
            $table->decimal('coin_balance', 20, 2)->default(0);
            $table->smallInteger('identity_verified')->nullable();
            $table->string('identity_image')->nullable();
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
        Schema::dropIfExists('customers');
    }
};
