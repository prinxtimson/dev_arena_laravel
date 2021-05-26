<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'image',
        'description',
        'url',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
