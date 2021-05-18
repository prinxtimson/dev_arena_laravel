<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
})->name('home');

//Route::post('/login', [LoginController::class, 'authenticate']);
// Route::middleware('auth:sanctum');

// Route::get('/dashboard/{name?}', ['as' => 'dashboard', function ($name = null) {
//     return view('welcome');
// }])->middleware('auth');

Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/dashboard/{name?}/{id?}', ['as' => 'dashboard', function ($name = null) {
        return view('welcome');
    }]);
});

Route::middleware(['auth', 'role:admin|super-admin'])->group(function () {
    Route::get('dashboard/users', function () {
        return view('welcome');
    })->name('dashboard.users');
    Route::get('dashboard/add-user', function () {
        return view('welcome');
    })->name('dashboard.add-user');
});

Route::middleware(['guest'])->group(function () {
    //
    Route::post('/login', [LoginController::class, 'authenticate']);
    Route::get('login', function () {
        return view('welcome');
    })->name('login');
    Route::get('reset-password/{token}', function () {
        return view('welcome');
    })->name('password.reset');
    Route::get('forgot-password', function () {
        return view('welcome');
    });
});