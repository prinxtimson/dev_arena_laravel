<?php

namespace App\Http\Controllers;
use Carbon\Carbon;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\User; 
use App\Models\Issue; 
use App\Notifications\IssueRaised;
use App\Notifications\IssueResolved;
use App\Notifications\IssueReopen;
use Illuminate\Support\Facades\Notification;
use App\Exports\BlockersExport;
use Maatwebsite\Excel\Excel;

class IssueController extends Controller
{
    private $excel;

    public function __construct(Excel $excel)
    {
        $this->excel = $excel;
    }

    public function export(Request $request, $id)
    {
        $from = $request->from;
        $to = $request->to;
        $resolved = $request->resolved;

        return $this->excel->download(new BlockersExport($id, $from, $to, $resolved), 'project_blockers.xlsx');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $id)
    {
        $from = $request->from;
        $to = $request->to;

        $project = Project::find($id);

        return $project->issues()->when($from, function($q) use ($from) {
            return $q->where('created_at', '>=', $from);
        })->when($to, function($q) use ($to) {
            return $q->where('created_at', '<=', $to);
        })->with(['comments' => function($q) {
            return $q->with('user')->get();
        }, 'user'])->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $id)
    {
        $user = auth()->user();
        $project = Project::find($id);
        $admins = User::role('admin')->get();

        $issue = $project->issues()->create([
            'details' => $request->details,
            'user_id' => $user->id,
            ]);

        $issue->update([
            'ticket_no' => 'DEVISSUE-'.$issue->id,
        ]);
        
        Notification::send($admins, new IssueRaised($user, $project));
        return $issue->refresh()->load(['comments', 'user']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Issue::find($id)->load(['project', 'comments', 'user']);
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
        $user = auth()->user();

        $issue = Issue::find($id);

        $issue->update($request->all());

        return $issue->refresh()->load(['project', 'comments', 'user']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Issue::destroy($id);
    }

    public function close($id)
    {
        $issue = Issue::find($id);
        $user = User::find($issue->raise_by);

        $issue->update([
            'resolve_at' => Carbon::now(),
        ]);

        $issue->refresh()->load(['project', 'comments', 'user']);

        $user->notify(new IssueResolved($issue));

        return $issue;
    }

    public function open($id)
    {
        $issue = Issue::find($id);

        $issue->update([
            'resolve_at' => null,
        ]);

        $issue->refresh()->load(['project', 'comments', 'user']);

        $user->notify(new IssueReopen($issue));

        return $issue;
    }
}
