<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;

class ERPNextController extends Controller
{
    public function logIn($username = '',$pwd = ''){
        $response = Http::post('http://erp.example.com:8000/api/method/login',[
            'usr' => $username,
            'pwd' => $pwd,
        ]);//inicio de sesion
        $respuesta = json_decode($response->body(),true);

        if($respuesta['message'] == 'Logged In'){
        $val = $response->headers()['Set-Cookie'][0];

        $sid = ERPNextController::setSid($val);

        $response = Http::get('http://erp.example.com:8000/api/resource/User/' . $username,[
            'sid'=> $sid
        ]);

        $respuesta = json_decode($response,true);

        $role = $respuesta['data']['roles'][0]['role'];

        }else{
            return redirect()->back()->with('alert','Las credenciales son incorrectas');
        }


        if($role == 'Administrator'){
            $response = Http::get('http://erp.example.com:8000/api/method/frappe.core.doctype.user.user.generate_keys?user=',[
            'sid'=> $sid,
            'user' => $username,
        ]);

        $secret = $response['message']['api_secret'];

        $response = Http::get('http://erp.example.com:8000/api/resource/User/' . $username,[
            'sid'=> $sid
        ]);

        $key =  ERPNextController::getKey(json_decode($response));

        Cookie::queue(Cookie::make('sid', $sid));
        ERPNextController::generateToken($key,$secret);

        return redirect()->route('timbrar');

        }else{
            return redirect()->back()->with('alert','No tienes permisos para timbrar');
        }
    }

    public function setSid($cookie = ''){
        $val = ERPNextController::split($cookie,',',0);

        $val = ERPNextController::split($val,';',0);

        $val = ERPNextController::split($val,'=',1);

        return $val;
    }

    public function split($chain = '', $character = '',$getPosition){
        $value = [];
        foreach (explode($character,$chain) as $row) {
            array_push($value,$row);
        }
        $val = $value[$getPosition];
        return $val;
    }

    public function getKey($json){
        $result;
        foreach ($json->data as $key => $value) {
            if ($key == "api_key") {
                $result = $value;
            }
        }
        return $result;
    }

    public function generateToken($key, $secret){
        $token = $key . '.' . $secret;
        Cookie::queue(Cookie::make('token',$token));
    }

    public function getInvoice($invoice){

        $response = Http::get('http://erp.example.com:8000/api/resource/Sales%20Invoice/'.$invoice,[
            'sid' => Cookie::get('sid'),
            'Authorization' => Cookie::get('token')
        ]);

        return response()->json(['message' => 'success', 'data' => $response['data']]);

    }

    public function iterador($obj){
        $array = array();
        foreach ($obj as $key => $value) {
            if(is_array($value)){
                $array = array_merge($array, ERPNextController::iterador($value));
            }else{
                $array[$key] = $value;
            }
        }
        return $array;
    }

}


