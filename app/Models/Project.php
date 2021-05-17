<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'slug',
        'avatar',
        'start',
        'end'
    ];
    protected $casts = [
        'start' => 'datetime',
        'end' => 'datetime',
    ];

    /**
     * The users that belong to the Project
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function developers()
    {
        return $this->belongsToMany(User::class, 'user_projects', 'user_id', 'project_id')->withTimestamps();
    }
}
