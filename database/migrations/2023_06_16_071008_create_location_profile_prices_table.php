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
        Schema::create('location_profile_prices', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('location_profile_id')->nullable();
            $table->ulid('customer_level_id')->nullable();
            $table->decimal('price', 20, 2)->default(0);
            $table->decimal('display_price', 20, 2)->default(0);
            $table->decimal('discount', 20, 0)->default(0);
            $table->decimal('price_poin', 20, 2)->default(0);
            $table->decimal('bonus_poin', 20, 2)->default(0);

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
        Schema::dropIfExists('location_profile_prices');
    }
};
