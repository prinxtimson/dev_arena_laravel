<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIssuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->string('details');
            $table->foreignId('raise_by')
                  ->constrained('users')->onDelete('cascade');
            $table->foreignId('assign_to')
                ->constrained('users')->nullable();
            $table->foreignId('project_id')
                ->constrained()->onDelete('cascade');
            $table->date('resolve_at')->nullable();
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
        Schema::dropIfExists('issues');
    }
}
