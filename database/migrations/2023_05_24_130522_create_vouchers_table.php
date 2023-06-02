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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->ulid('location_id')->nullable();
            $table->string('username')->nullable();
            $table->string('password')->nullable();
            $table->decimal('price', 20, 2)->default(0);
            $table->decimal('discount', 20, 0)->default(0);
            $table->decimal('display_price', 20, 2)->default(0);
            $table->string('quota')->nullable();
            $table->string('profile')->nullable();
            $table->text('comment')->nullable();
            $table->string('expired')->nullable();
            $table->string('expired_unit')->nullable();
            $table->smallInteger('is_sold')->default(0);
            $table->ulid('batch_id')->nullable();
            $table->text('additional_json')->nullable();

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
        Schema::dropIfExists('vouchers');
    }
};
