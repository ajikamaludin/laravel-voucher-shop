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
            $table->ulid('location_profile_id')->nullable();
            $table->string('username')->nullable();
            $table->string('password')->nullable();
            $table->string('quota')->nullable();
            $table->string('profile')->nullable();
            $table->text('comment')->nullable();
            $table->smallInteger('is_sold')->default(0);
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
