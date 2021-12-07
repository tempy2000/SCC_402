<?php 
    header("Content-Type: application/json");
    $data = json_decode(file_get_contents("php://input"));
    $file = fopen("logs/" . $data->start . ".json", "w");
    fwrite($file, $data);
    fclose($file);
?>