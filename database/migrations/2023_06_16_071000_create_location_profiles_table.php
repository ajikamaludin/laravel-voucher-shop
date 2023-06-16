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
        Schema::create('location_profiles', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('location_id')->nullable();
            $table->string('name')->nullable();
            $table->string('quota')->nullable();
            $table->string('display_note')->nullable();
            $table->string('expired')->nullable();
            $table->string('expired_unit')->nullable();
            $table->string('description')->nullable();
            $table->integer('min_stock')->default(0);

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
        Schema::dropIfExists('location_profiles');
    }
};
