<?php

namespace App\Exports;

use App\Models\Project;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;

class ProjectsExport implements FromQuery, WithMapping, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell, WithTitle
{
    use Exportable;

    private $start;
    private $end;
    
    public function __construct($start, $end)
    {
        $this->start = $start;
        $this->end = $end;
    }

    public function query()
    {
        $start = $this->start;
        $end = $this->end;
        return Project::query()->when($start, function($q) use ($start) {
            return $q->where('start_at', '>=', $start);
        })->when($end, function($q) use ($end) {
            return $q->where('end_at', '<=', $end);
        })->with('reports');
    }

    public function map($project): array
    {
        $developers = array();
        foreach($project->developers as $dev) {
            array_push($developers, $dev->name);
        }
        return [
            $project->id,
            $project->name,
            $project->project_owner,
            $project->project_pm,
            $project->ba_lead,
            $project->scrum_master,
            $project->dev_liason_officer,
            $project->assign_at,
            implode(", ", $developers),
            $project->mandate,
            $project->start_at,
            $project->est_end_at,
            $project->end_at,
            $project->created_at,
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Project Name',
            'Project Owner',
            'Project PM',
            'Project BA Lead',
            'Project Scrum Master',
            'Developer Liason Officer',
            'Assigned At',
            'Developer',
            'Project Mandate',
            'Start Date',
            'Estimated End Date',
            'End Date',
            'Created At',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getStyle('A1:N1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
            },
        ];
    }

    public function startCell(): string
    {
        return 'A1';
    }

    public function title(): string
    {
        return 'Projects Table';
    }
}
