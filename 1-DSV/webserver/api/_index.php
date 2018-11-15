<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");

include 'Core.Api.php';
include 'Core.Script.php';

new \Core\Api();