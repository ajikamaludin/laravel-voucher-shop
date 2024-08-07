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
        Schema::create('paylater_customers', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->text('description')->nullable();
            $table->ulid('customer_id')->nullable();
            $table->decimal('limit', 20, 2)->default(0);
            $table->decimal('usage', 20, 2)->default(0);
            $table->smallInteger('day_deadline')->default(0);
            $table->timestamp('day_deadline_at')->nullable();

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
        Schema::dropIfExists('paylater_customers');
    }
};
