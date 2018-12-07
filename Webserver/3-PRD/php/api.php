<?php
header("Access-Control-Allow-Origin: *");

//Todos os includes necessários está aqui.
include 'includes.php';

$api = new WebAPI();
$api->ProcessarComando();

?>