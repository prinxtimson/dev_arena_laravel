<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->string('avatar')->nullable();
            $table->text('mandate');
            $table->string('project_pm')->nullable();
            $table->string('project_owner')->nullable();
            $table->string('ba_lead')->nullable();
            $table->string('scrum_master')->nullable();
            $table->string('dev_liason_officer')->nullable();
            $table->date('assign_at')->nullable();
            $table->date('start_at');
            $table->date('est_end_at');
            $table->date('end_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('projects');
    }
}
