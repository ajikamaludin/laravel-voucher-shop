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
        Schema::create('customer_as_data_partners', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('customer_id')->nullable();
            $table->string('job')->nullable();
            $table->string('image_selfie')->nullable();
            $table->string('file_statement')->nullable();
            $table->string('file_agreement')->nullable();
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
        Schema::dropIfExists('customer_as_data_partners');
    }
};
