<?php 
    header("Content-Type: application/json");
    $data = json_decode(file_get_contents("php://input"));
    $file = fopen("logs/" . $data->app_id . "_" . $data->route_id . "_" . $data->start . ".json", "w");
    fwrite($file, json_encode($data));
    fclose($file);
?>