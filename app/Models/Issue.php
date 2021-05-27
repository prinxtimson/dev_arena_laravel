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
        'assign_to',
        'raise_by',
    ];

    protected $casts = [
        'resolve_at' => 'datetime',
    ];

    public function raise_by ()
    {
        return $this->belongsTo(User::class, 'raise_by');
    }

    public function assign_to ()
    {
        return $this->belongsTo(User::class, 'assign_to');
    }

    public function project ()
    {
        return $this->belongsTo(Project::class);
    }
}
