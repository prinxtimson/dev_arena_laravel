<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\CommentController;
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
//->middleware('auth:sanctum');

//Protected routes 
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/mark-notification', [AuthController::class, 'markNotification']);
    Route::post('/upload-avatar', [AuthController::class, 'upload']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::get('/developers', [UserController::class, 'dev']);
    Route::get('/users/search/{role}', [UserController::class, 'search_by_role']);
    Route::put('/change-password', [AuthController::class, 'changePass']);
    Route::put('/update', [AuthController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::put('/accept-project', [ProjectController::class, 'accept_project']);
    Route::put('/decline-project', [ProjectController::class, 'decline_project']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);

    Route::get('/reports', [ReportController::class, 'index']);
    //Route::get('/reports/{id}', [ReportController::class, 'show']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::put('/reports/{id}', [ReportController::class, 'update']);
    Route::delete('/reports/{id}', [ReportController::class, 'destroy']);

    Route::get('/issues/{id}', [IssueController::class, 'index']);
    Route::post('/issues/{id}', [IssueController::class, 'store']);
    Route::put('/issues/{id}', [IssueController::class, 'update']);
    Route::delete('/issues/{id}', [IssueController::class, 'destroy']);

    Route::get('/comments/{id}', [CommentController::class, 'index']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    Route::get('/resources', [ResourceController::class, 'index']);
    Route::get('/resources/{id}', [ResourceController::class, 'show']);
    Route::post('/resources', [ResourceController::class, 'store']);
    Route::put('/resources/{id}', [ResourceController::class, 'update']);
    Route::put('/resources/remove-file/{id}/{index}', [ResourceController::class, 'remove_file']);
    Route::delete('/resources/{id}', [ResourceController::class, 'destroy']);
});

Route::group(['middleware' => ['auth:sanctum', 'role:admin|super-admin']], function () {
    //
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::put('/projects/close/{id}', [ProjectController::class, 'close']);
    Route::put('/projects/remove-file/{id}/{index}', [ProjectController::class, 'remove_file']);
    Route::get('/issues/close/{id}', [IssueController::class, 'close']);
    Route::get('/issues/open/{id}', [IssueController::class, 'open']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    //Route::put('/projects', [ProjectController::class, 'update']);
    Route::put('/assign-dev/{id}/{dev}', [ProjectController::class, 'assign_dev']);
    Route::put('/detach-dev/{id}/{dev}', [ProjectController::class, 'detach_dev']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);
    Route::put('users/disable/{id}', [UserController::class, 'disable']);
    Route::put('users/enable/{id}', [UserController::class, 'enable']);
});

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
