<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Token</title>
    <!-- Styles -->
    <link href="{{ asset('/css/mdb.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/app.css') }}" rel="stylesheet">

</head>

<body>

    <div class="container mt-5">
        <div class="row justify-content-center">
         0   <div class="col-md-8">
                <div class="card text-center">
                    <div class="card-title mt-2"><h2>Inicio de Sesion</h2></div>
                    <div id="first"></div>

                </div>
            </div>
        </div>
    </div>

    <!-- React root DOM -->


    <!-- React JS -->
    <script src="{{ asset('/js/app.js') }}" defer></script>

</body>
</html>
