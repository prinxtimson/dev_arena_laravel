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
});

Route::post('/login', [LoginController::class, 'authenticate']);
Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth');

Route::get('/dashboard/{name?}', ['as' => 'dashboard', function ($name = null) {
    return view('welcome');
}])->middleware('auth');

Route::middleware(['guest'])->group(function () {
    //
    Route::get('/login', function () {
        return view('welcome');
    })->name('login');
    Route::get('/reset-password/{token}', function () {
        return view('welcome');
    })->name('password.reset');
    Route::get('/forgot-password', function () {
        return view('welcome');
    });
});