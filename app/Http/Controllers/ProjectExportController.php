<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Exports\ProjectsExport;
use App\Exports\ProjectMultiSheetExport;
use Maatwebsite\Excel\Excel;

class ProjectExportController extends Controller
{
    private $excel;

    public function __construct(Excel $excel)
    {
        $this->excel = $excel;
    }

    public function export(Request $request)
    {
        $start = $request->start;
        $end = $request->end;

        return $this->excel->download(new ProjectsExport($start, $end), 'projects.xlsx');
    }

    public function export_one(Request $request, $id)
    {
        $report = $request->report;
        $blocker = $request->blocker;

        $project = Project::find($id);

        return $this->excel->download(new ProjectMultiSheetExport($id, $report, $blocker), $project->slug.'.xlsx');
    }
}
