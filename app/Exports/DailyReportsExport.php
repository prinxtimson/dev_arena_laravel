<?php

namespace App\Exports;

use App\Models\Report;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;

class DailyReportsExport implements FromQuery, WithMapping, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell, WithTitle
{
    use Exportable;

    private $id;
    private $from;
    private $to;
    
    public function __construct($id, $from, $to)
    {
        $this->id = $id;
        $this->from = $from;
        $this->to = $to;
    }

    public function query()
    {
        $from = $this->from;
        $to = $this->to;

        return Report::query()->where('project_id', $this->id)->when($from, function($q) use ($from) {
            return $q->where('created_at', '>=', $from);
        })->when($to, function($q) use ($to) {
            return $q->where('created_at', '<=', $to);
        })->with(['user', 'project']);
    }

    public function map($reports): array
    {
        return [
            $reports->id,
            $reports->details,
            $reports->user->name,
            $reports->project->name,
            $reports->created_at,
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Details',
            'Developer',
            'Project',
            'Created At',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getStyle('A1:E1')->applyFromArray([
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
        return 'Project Daily Reports';
    }
}