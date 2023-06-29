<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

class CustomerAsDataPartner extends Model
{
    protected $fillable = [
        'customer_id',
        'id_number',
        'job',
        'image_selfie',
        'file_statement',
        'file_agreement',
        'additional_json',
    ];

    protected $appends = [
        'image_selfie_url',
        'file_statement_url',
        'file_agreement_url',
    ];

    public function imageSelfieUrl(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->image_selfie != null) {
                return asset($this->image_selfie);
            }

        });
    }

    public function fileStatementUrl(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->file_statement != null) {
                return asset($this->file_statement);
            }

        });
    }

    public function fileAgreementUrl(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->file_agreement != null) {
                return asset($this->file_agreement);
            }

        });
    }
}
