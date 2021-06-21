<?php

namespace App\Exports;

use App\Models\Issue;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;

class BlockersExport implements FromQuery, WithMapping, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell, WithTitle
{
    use Exportable;

    private $id;
    private $from;
    private $to;
    private $resolved;
    
    public function __construct($id, $from, $to, $resolved)
    {
        $this->id = $id;
        $this->from = $from;
        $this->to = $to;
        $this->resolved = $resolved;
    }

    public function query()
    {
        $from = $this->from;
        $to = $this->to;
        $resolved = $this->resolved;

        return Issue::query()->where('project_id', $this->id)->when($from, function($q) use ($from) {
            return $q->whereDate('created_at', '>=', $from);
        })->when($to, function($q) use ($to) {
            return $q->whereDate('created_at', '<=', $to);
        })->when($resolved, function($q) use ($resolved) {
            if ($resolved) {
                return $q->where('resolve_at');
            }
            return $q->whereNull('resolve_at');
        })->with(['user', 'project']);
    }

    public function map($issues): array
    {
        return [
            $issues->id,
            $issues->details,
            $issues->ticket_no,
            $issues->user->name,
            $issues->project->name,
            $issues->resolve_at,
            $issues->created_at,
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Details',
            'Ticket No',
            'Developer',
            'Project',
            'Resolved At',
            'Created At',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getStyle('A1:G1')->applyFromArray([
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
        return 'Project Blockers';
    }
}
