<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'text',
        'issue_id',
        'user_id',
    ];

    public function user ()
    {
        return $this->belongsTo(User::class);
    }

    public function issue ()
    {
        return $this->belongsTo(Issue::class);
    }
}
