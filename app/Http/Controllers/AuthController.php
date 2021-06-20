<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\UploadedFile;

class AuthController extends Controller
{

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
            'user' => $user->load(['profile', 'projects', 'roles', 'resources']),
            'token' => $token
        ];

        return response($response, 200);
    }

    public function me(Request $request) {
        $user = auth()->user()->load(['profile', 'projects', 'roles', 'resources']);
        $notifications = auth()->user()->notifications;
        $count = auth()->user()->unreadNotifications->count();
        $response = [
            'user' => $user,
            'notifications' => [
                'data' => $notifications,
                'count' => $count
            ],
            'project'
        ];
        return $response;
    }

    public function logout(Request $request) {
        auth()->user()->tokens()->delete();

        return [
            'msg' => 'Logged out'
        ];
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $fields = $request->validate([
            'firstname' => 'required|string',
            'lastname' => 'required|string',
        ]);

        //$user = User::find($user);
        $user->update([
            'name' =>  $fields['firstname'].' '.$fields['lastname'],
            'username' => strtolower($fields['firstname'].$fields['lastname']),
        ]);

        $user->profile()->update($request->all());

        $response = [
            'user' => $user->load(['profile', 'projects', 'roles', 'resources']),
            'msg' => 'Profile updated successfuly.'
        ];

        return $response;
    }

    public function summary()
    {
        $projects = Project::count();
        $completed = Project::whereDate('end_at', '<=', Carbon::now())->count();
        $pending = Project::whereNull('assign_at')->whereDate('end_at', '>=', Carbon::now())->count();
        $progress = Project::whereNotNull('assign_at')->whereDate('end_at', '>=', Carbon::now())->count();
        $extend = Project::whereColumn('end_at', '>', 'est_end_at')->whereDate('end_at', '>=', Carbon::now())->count();
        $users = User::withTrashed()->count();

        return $response = [
            'total_projects' => $projects,
            'completed_projects' => $completed,
            'pending_projects' => $pending,
            'in_progress_projects' => $progress,
            'extended_projects' => $extend,
            'users' => $users,
        ];
    }

    public function changePass(Request $request)
    {
        $user = auth()->user();

        $fields = $request->validate([
            'password' => 'required|string',
            'new_password' => 'required|string|confirmed'
        ]);

        if(!Hash::check($fields['password'], $user->password)) {
            return response([
                'message' => 'wrong password'
            ], 401);
        }

        if(!$user->email_verified_at) {
            $user->markEmailAsVerified();
        }
        $user->update([
            'password' => bcrypt($fields['new_password']),
        ]);

        return response([
            'msg' => 'password update successful'
        ]);
    }

    public function forgotPass(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
                    ? back()->with(['status' => __($status)])
                    : back()->withErrors(['email' => __($status)]);
    }

    public function resetPass(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);
    
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));
    
                $user->save();
    
                event(new PasswordReset($user));
            }
        );
    
        return $status == Password::PASSWORD_RESET
                    ? redirect()->route('login')->with('status', __($status))
                    : back()->withErrors(['email' => [__($status)]]);
    }

    public function upload(Request $request)
    {
        $user = auth()->user();

        $user->clearMediaCollection('avatars');

        $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');

        $mediaUrl = $user->getFirstMediaUrl('avatars');

        $user->update([
            'avatar' => $mediaUrl,
        ]);

        $user->refresh()->load(['profile', 'projects', 'roles', 'resources']);

        $response = [
            'user' => $user,
            'msg' => 'Image uploaded successfuly',
        ];

        return $response;

    }

    public function markNotification()
    {
        $user = auth()->user();

        $user->unreadNotifications->markAsRead();

        $response = [
            'data' => $user->notifications,
            'count' => $user->unreadNotifications->count(),
        ];

        return $response;
    }
}
