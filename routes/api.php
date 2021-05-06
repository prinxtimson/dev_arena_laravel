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
Route::get('/projects', [ProjectController::class, 'index']);
Route::post('/projects', [ProjectController::class, 'store']);
Route::get('/users', [UserController::class, 'index']);
//->middleware('auth:sanctum');

//Protected routes 
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('change_password', [AuthController::class, 'changePass']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::group(['middleware' => ['auth:sanctum', 'role:admin']], function () {
    //
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
});

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
