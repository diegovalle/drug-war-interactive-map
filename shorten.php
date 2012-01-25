<?php

    //the long url posted by the map webpage
    $url = $_GET["url"];

    //You have to create an account on bit.ly and modify the username and API key.
    $api_user = "username";
    $api_key = "api_key";

    //send it to the bitly shorten webservice
    $ch = curl_init ("http://api.bitly.com/v3/shorten?login=$api_user&apiKey=$api_key&longUrl=$url&format=json");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    //the response is a JSON object, send it to the webpage with a callback
    echo $_GET['jsoncallback'] . '(' . curl_exec($ch) . ');';
?>
