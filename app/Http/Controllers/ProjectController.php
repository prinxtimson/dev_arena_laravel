<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Project; 
use App\Models\User;
use Illuminate\Http\Request;
use App\Notifications\AssignDev;
use App\Notifications\AcceptProject;
use App\Notifications\DeclineProject;
use Illuminate\Support\Facades\Mail;
use App\Mail\DevAssignEmail;

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
        return Project::with(['developers', 'issues' => function ($query) {
            $query->where('resolve_at', '=', null);
        }])->paginate(20);
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
            'start_at' => 'required',
            'end_at' => 'required'
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
        return Project::find($id)->load('developers');
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

        $project->load(['developers', 'issues' => function ($query) {
            $query->where('resolve_at', '=', null);
        }]);

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

    public function close($id)
    {
        $project = Project::find($id);

        $project->update([
            'end_at' => Carbon::now(),
        ]);

        $project->refresh()->load(['developers', 'issues' => function ($query) {
            $query->where('resolve_at', '=', null);
        }]);

        $response = [
            'project' => $project,
            'msg' => 'Project closed successfully.'
        ];

        return $response;
    }

    public function assign_dev(Request $request, $id, $dev)
    {
        $user = User::find($dev);

        $assign_by = auth()->user();

        $project = Project::find($id)->load('developers');

        $project->developers()->attach($dev);

        $project->update(['assign_at' => Carbon::now()]);

        $project->refresh()->load(['developers', 'issues' => function ($query) {
            $query->where('resolve_at', '=', null);
        }]);

        $fields = [
            'project' => $project,
            'user' => $user
        ];

        $user->notify(new AssignDev($assign_by, $project));
        //Mail::to($user)->send(new DevAssignEmail($fields));

        return $project;
    }

    public function accept_project(Request $request)
    {
        $admin = User::find($request->user_id);

        $user = auth()->user();

        $project = Project::find($request->project_id);

        $admin->notify(new AcceptProject($user, $project));
    }

    public function decline_project(Request $request)
    {
        $user = auth()->user();

        $admin = User::find($request->user_id);

        $project = Project::find($request->project_id);

        $project->developers()->detach($user->id);

        $admin->notify(new DeclineProject($user, $project));
    }
}
