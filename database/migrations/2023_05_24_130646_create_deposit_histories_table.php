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
        Schema::create('deposit_histories', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->decimal('debit', 20, 2)->default(0);
            $table->decimal('credit', 20, 2)->default(0);
            $table->string('description')->nullable();
            $table->text('note')->nullable();
            $table->ulid('customer_id')->nullable();
            $table->ulid('account_id')->nullable();
            $table->ulid('deposit_location_id')->nullable();
            $table->string('related_type')->nullable();
            $table->string('related_id')->nullable();
            $table->smallInteger('is_valid')->default(0);
            $table->smallInteger('type')->default(0);
            $table->string('image_prove')->nullable();
            $table->string('payment_channel')->nullable();
            $table->string('payment_token')->nullable();
            $table->string('payment_status')->nullable();
            $table->text('payment_response')->nullable();
            $table->string('payment_type')->nullable();

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
        Schema::dropIfExists('deposit_histories');
    }
};
