<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Timbrado</title>
    <!-- Styles -->
    <link href="{{ asset('/css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/mdb.min.css') }}" rel="stylesheet">

</head>
@php



$response = \Illuminate\Support\Facades\Http::get('http://erp.example.com:8000/api/resource/Sales%20Invoice',[
    'sid' => \Cookie::get('sid'),
    'Authorization' => \Cookie::get('token')
]);

$data = $response['data'];

$invoices = [];
foreach ($data as $key => $value) {
    array_push($invoices,$value['name']);
}

@endphp
<body>
    <header>
        <div id="fourth"></div>
    </header>

    <div class="container-ml mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card text-center">
                    <div class="card-title mt-2"><h2>Timbrado</h2></div>

                    <div class="card-body">Llena los campos vacios para generar el CFDI</div>
                    <div id="second" invoices="{{ json_encode($invoices) }}"></div>

                </div>
            </div>
        </div>
    </div>

    <!-- React root DOM -->


    <!-- React JS -->
    <script src="{{ asset('/js/app.js') }}" defer></script>

</body>
</html>
