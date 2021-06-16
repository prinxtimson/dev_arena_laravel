<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\Exportable;

class ProjectMultiSheetExport implements WithMultipleSheets
{
    use Exportable;

    private $id;
    private $report;
    private $bloker;

    public function __construct(int $id, $report, $blocker)
    {
        $this->id = $id;
        $this->report = $report;
        $this->blocker = $blocker;
    }

    public function sheets(): array
    {
        $sheets = [];

        $sheets[] = new ProjectExport($this->id);
        if($this->report === 'true'){
            $sheets[] = new DailyReportsExport($this->id, null, null);
        }
        if($this->blocker === 'true'){
            $sheets[] = new BlockersExport($this->id, null, null, null);
        }

        return $sheets;
    }
}
