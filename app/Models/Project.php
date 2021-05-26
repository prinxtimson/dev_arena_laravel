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
        'mandate',
        'project_pm',
        'start',
        'expected_end',
        'end'
    ];
    protected $casts = [
        'start' => 'datetime',
        'end' => 'datetime',
        'expected_end' => 'datetime',
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

    public function reports() {
        return $this->hasMany(Report::class);
    }

    public function issues ()
    {
        return $this->hasMany(Issue::class);
    }
}
