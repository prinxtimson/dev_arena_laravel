<?php

namespace App\Http\Controllers;

use App\Models\Project; 
use App\Models\User;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return Project::paginate(20);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name' => 'required',
            'start' => 'required',
            'end' => 'required'
        ]);

        $project = Project::create($request->all());

        $response = [
            'project' => $project,
            'msg' => 'Project added successfully.'
        ];

        return response($response, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        return Project::find($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
        $project = Project::find($id);
        $project->update($request->all());

        $response = [
            'project' => $project,
            'msg' => 'Project updated successfully.'
        ];

        return $response;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        return  Project::destroy($id);
    }

    public function assign_dev($project_id, $dev_id)
    {
        $user = User::find($dev_id)->where();

        $project = Project::find($project_id);

        $project->users()->attach($dev_id);

        $project->refresh();

        return $project;
    }
}
