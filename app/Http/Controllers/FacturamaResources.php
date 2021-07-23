<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
require __DIR__.'/vendor/autoload.php';

$facturama = new \Facturama\Client('username', 'password');

class FacturamaResources extends Controller
{



}
