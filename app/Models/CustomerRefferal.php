<?php

namespace App\Models;

class CustomerRefferal extends Model
{
    protected $fillable = [
        'customer_id', //customer has code
        'refferal_id', //customer use the code
        'customer_code', //code of referal
    ];
}
