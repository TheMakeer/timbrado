<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\ERPNextController;
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

Route::get('/', function (Request $req){
    if (Cookie::get('sid') && Cookie::get('token')) {
        return redirect('/formulario');
    }
    return view('welcome');
});

Route::get('/formulario', function (){
    return view('formulario');
})->middleware('check.token')->name('timbrar');

Route::get('/logout', function (){
    if(\Cookie::get('sid')){
        print_r(\Cookie::get());
        $cookie = \Cookie::forget('sid');
        return redirect('/logout')->withCookie($cookie);
    }else if(\Cookie::get('token')){
        $cookie = \Cookie::forget('token');
        return redirect('/')->withCookie($cookie);
    }else{

        return redirect()->back()->with('alert','No hay una sesion activa.');
    }

});


Route::get('/check/{username}/{pwd}', [ERPNextController::class, 'logIn'])->name('process');

Route::get('/getInvoice/{invoice}', [ERPNextController::class, 'getInvoice']);


