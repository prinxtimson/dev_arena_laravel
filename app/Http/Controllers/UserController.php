<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Events\Illuminate\Auth\Events\NewUserAdded;
use Illuminate\Support\Facades\Hash;
use App\Mail\NewUser;
use Illuminate\Support\Facades\Mail;
use App\Exports\UsersExport;
use Maatwebsite\Excel\Excel;

class UserController extends Controller
{
    private $excel;

    public function __construct(Excel $excel)
    {
        $this->excel = $excel;
    }

    public function export(Request $request)
    {
        $role = $request->role;

        return $this->excel->download(new UsersExport($role), 'users_table.xlsx');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $users = User::withTrashed()->with(['roles', 'projects' => function ($query) {
            $query->where('end_at', '>', Carbon::now());
        }])->paginate(20);

        return $users;
    }

    public function dev()
    {
        $users = User::whereHas(
            'roles', function($q){
                $q->where('name', 'developer');
            }
        )->with(['roles', 'projects' => function ($query) {
            $query->where('end_at', '>', Carbon::now());
        }])->get();

        return $users;
    }

    public function search_by_role($role)
    {
        $users = User::whereHas(
            'roles', function($q) use ($role){
                $q->where('name', $role);
            }
        )->with(['roles', 'projects' => function ($query) {
            $query->where('end_at', '>', Carbon::now());
        }])->paginate(20);

        return $users;
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
        $fields = $request->validate([
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'role' => 'required|string',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string'
        ]);

        $hash = md5(strtolower(trim($fields['email'])));

        $user = User::create([
            'name' =>  $fields['firstname'].' '.$fields['lastname'],
            'email' => $fields['email'],
            'username' => strtolower($fields['firstname'].$fields['lastname']),
            'avatar' => 'https://www.gravatar.com/avatar/'.$hash,
            'password' => bcrypt($fields['password'])
        ]);

        $user->profile()->create([
            'firstname' => $fields['firstname'],
            'lastname' => $fields['lastname'],
        ]);

        $user->assignRole($fields['role']);

        //event(new NewUserAdded($fields));
        Mail::to($user)->send(new NewUser($fields));

        $response = [
            'user' => $user,
            'msg' => 'User added successfully.'
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
        return User::find($id)
                    ->load(['profile', 'roles', 'projects']);
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
        $fields = $request->validate([
            'firstname' => 'required|string',
            'lastname' => 'required|string',
        ]);

        $user = User::find($id);
        $user->update([
            'name' =>  $fields['firstname'] .' '. $fields['lastname'],
            'username' => strtolower($fields['firstname'].$fields['lastname']),
        ]);

        $user->profile()->update($request->all());

        $user->refresh()->load(['profile', 'roles', 'projects']);

        $response = [
            'user' => $user,
            'msg' => 'User updated successfully.'
        ];

        return response($response);
    }

    public function disable($id)
    {
        User::find($id)->delete();

        $user = User::withTrashed()->find($id)->load(['roles', 'projects' => function ($query) {
            $query->where('end_at', '>', Carbon::now());
        }]);

        return $user;
    }

    public function enable($id)
    {
        User::withTrashed()->find($id)->restore();

        $user = User::withTrashed()->find($id)->load(['roles', 'projects' => function ($query) {
            $query->where('end_at', '>', Carbon::now());
        }]);

        return $user;
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
        return User::forceDelete($id);
    }
}
