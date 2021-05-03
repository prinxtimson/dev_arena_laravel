<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //
    public function login(Request $request) {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        //check email
        $user = User::where('email', $fields['email'])->first();

        //Check password
        if(!$user || !Hash::check($fields['password'], $user->password)) {
            return response([
                'message' => 'invalid credentials'
            ], 401);
        }

        $token = $user->createToken('access_token')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 200);
    }

    public function me(Request $request) {
        return auth()->user()->load(['profile', 'projects']);
    }

    public function logout(Request $request) {
        auth()->user()->tokens()->delete();

        return [
            'message' => 'Logged out'
        ];
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $fields = $request->validate([
            'name' => 'string'
        ]);

        //$user = User::find($user);
        $user->update([
            empty($fields['name'])? null : 'name' => $fields['name'],
        ]);

        return $user;
    }

    public function changePass(Request $request)
    {
        $user = auth()->user();

        $fields = $request->validate([
            'old_password' => 'required|string',
            'new_password' => 'required|string|confirmed'
        ]);

        if(!Hash::check($fields['password'], $user->password)) {
            return response([
                'message' => 'wrong password'
            ], 401);
        }

        $user->update([
            'password' => bcrypt($fields['new_password'])
        ]);

        return response([
            'message' => 'password update successful'
        ]);
    }
}
