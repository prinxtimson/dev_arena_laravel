<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Issue extends Model
{
    use HasFactory;

    protected $fillable = [
        'details',
        'resolve_at',
        'user_id',
        'ticket_no',
    ];

    protected $casts = [
        'resolve_at' => 'datetime',
    ];

    public function user ()
    {
        return $this->belongsTo(User::class);
    }

    public function project ()
    {
        return $this->belongsTo(Project::class);
    }

    public function comments ()
    {
        return $this->hasMany(Comment::class);
    }
}
