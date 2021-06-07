<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Project extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'name',
        'slug',
        'avatar',
        'mandate',
        'project_pm',
        'project_owner',
        'ba_lead',
        'scrum_master',
        'dev_liason_officer',
        'assign_at',
        'start_at',
        'est_end_at',
        'end_at'
    ];
    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'est_end_at' => 'datetime',
        'assign_at' => 'datetime'
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

    public function files() {
        return $this->hasMany(File::class);
    }

    public function issues ()
    {
        return $this->hasMany(Issue::class);
    }
}
