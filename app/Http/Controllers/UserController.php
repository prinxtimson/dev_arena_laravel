<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Events\Illuminate\Auth\Events\NewUserAdded;
use Illuminate\Support\Facades\Hash;
use App\Mail\NewUser;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $users = User::with('roles')->paginate(20);

        return $users;
    }

    public function dev()
    {
        $users = User::whereHas(
            'roles', function($q){
                $q->where('name', 'developer');
            }
        )->get();

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
                    ->load(['profiles', 'roles', 'projects']);
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
            'role' => 'required|string',
        ]);

        $user = User::find($id);
        $user->update([
            'name' =>  $fields['firstname'] . $fields['lastname'],
        ]);

        $user->profile()->update();

        $response = [
            'user' => $user,
            'msg' => 'User updated successfully.'
        ];

        return response($response);
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
        return User::destroy($id);
    }
}
