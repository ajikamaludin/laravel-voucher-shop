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
        Schema::create('paylater_tenor_histories', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('customer_id')->nullable();
            $table->smallInteger('day_deadline')->nullable();
            $table->string('file_agreement')->nullable();
            $table->text('description')->nullable();

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
        Schema::dropIfExists('paylater_tenor_histories');
    }
};
