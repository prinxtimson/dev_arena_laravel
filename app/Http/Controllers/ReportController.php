<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project; 
use App\Models\Report; 
use App\Exports\DailyReportsExport;
use Maatwebsite\Excel\Excel;

class ReportController extends Controller
{
    private $excel;

    public function __construct(Excel $excel)
    {
        $this->excel = $excel;
    }

    public function export(Request $request)
    {
        $from = $request->from;
        $to = $request->to;
        $id = $request->id;

        return $this->excel->download(new DailyReportsExport($id, $from, $to), 'project_daily_reports.xlsx');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $from = $request->from;
        $to = $request->to;

        return Report::orderBy('id', 'DESC')->when($from, function($q) use ($from) {
            return $q->where('created_at', '>=', $from);
        })->when($to, function($q) use ($to) {
            return $q->where('created_at', '<=', $to);
        })->with('user')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        $reports = $user->reports()->create([
            'details' => $request->details,
            ]);

        return $reports->load('user');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Report::find($id)->load('user');
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

        $report = Report::find($id);

        $report->update($request->all());

        return $report->refresh()->load('user');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Report::destroy($id);
    }
}
