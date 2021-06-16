<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class UsersExport implements FromQuery, WithMapping, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell
{
    use Exportable;

    private $role;
    
    public function __construct($role)
    {
        $this->role = $role;
    }

    public function query()
    {
        $role = $this->role;
       // if($role){
            return User::query()->withTrashed()->when($role, function($q) use ($role) {
                return $q->role($role);
            })->with(['roles', 'projects']);
            // }
            // return User::query()->withTrashed()->with(['roles', 'projects']);
    }

    public function map($user): array
    {
        $roles = array();
        foreach($user->roles as $role) {
            array_push($roles, $role->name);
        }

        $projects = array();
        foreach($user->projects as $project) {
            array_push($projects, $project->name);
        }

        return [
            $user->id,
            $user->name,
            $user->username,
            $user->email,
            implode(", ", $roles),
            implode(", ", $projects),
            $user->deleted_at ? 'Deactivated' : 'Activated',
            $user->created_at,
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Username',
            'Email',
            'Roles',
            'Projects',
            'Status',
            'Created At',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getStyle('A1:H1')->applyFromArray([
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
}
