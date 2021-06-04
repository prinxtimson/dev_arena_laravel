<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;
    protected $fillable = [
        'firstname',
        'lastname',
        'phone',
        'dev_stack',
        'github',
        'user_id',
        'location'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
