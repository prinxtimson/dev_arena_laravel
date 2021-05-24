<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::resource('projects', ProjectController::class);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPass']);
Route::post('/reset-password', [AuthController::class, 'resetPass']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/users', [UserController::class, 'index']);
//->middleware('auth:sanctum');

//Protected routes 
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/mark-notification', [AuthController::class, 'markNotification']);
    Route::post('/upload-avatar', [AuthController::class, 'upload']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::get('/developers', [UserController::class, 'dev']);
    Route::put('/change-password', [AuthController::class, 'changePass']);
    Route::put('/update', [AuthController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/accept-project', [ProjectController::class, 'accept_project']);
    Route::put('/decline-project', [ProjectController::class, 'decline_project']);
});

Route::group(['middleware' => ['auth:sanctum', 'role:admin|super-admin']], function () {
    //
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    //Route::put('/projects', [ProjectController::class, 'update']);
    Route::put('/assign-dev/{id}/{dev}', [ProjectController::class, 'assign_dev']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);
});

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
