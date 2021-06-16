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

class ProjectExport implements FromQuery, WithMapping, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell, WithTitle
{
    use Exportable;

    private $id;
    
    public function __construct($id)
    {
        $this->id = $id;
    }

    public function query()
    {
        return Project::query()->where('id', $this->id);
    }

    public function map($project): array
    {
        $developers = array();
        foreach($project->developers as $dev) {
            array_push($developers, $dev->name);
        }
        return [
            [
               'Project Id',
               $project->id,
            ],
            [
                'Project Name',
                $project->name,
            ],
            [
                'Project Onwer',
                $project->project_owner,
            ],
            [
                'Project PM',
                $project->project_pm,
            ],
            [
                'Project BA Lead',
                $project->ba_lead,
            ],
            [
                'Project Scrum Master',
                $project->scrum_master,
            ],
            [
                'Developer Liason Officer',
                $project->dev_liason_officer,
            ],
            [
                'Assigned Date',
                $project->assign_at,
            ],
            [
                'Developers',
                implode(", ", $developers),
            ],
            [
                'Project Mandate',
                $project->mandate,
            ],
            [
                'Project Start Date',
                $project->start_at,
            ],
            [
                'Project Estimated End Date',
                $project->est_end_at,
            ],
            [
                'Project End Date',
                $project->end_at,
            ],
            [
                'Created At',
                $project->created_at,
            ]
        ];
    }

    public function headings(): array
    {
        return [
            'Key',
            'Value',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getStyle('C5:D5')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
                $event->sheet->getStyle('C6:C19')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
            },
        ];
    }

    public function startCell(): string
    {
        return 'C5';
    }

    public function title(): string
    {
        return 'Project Details';
    }
}
