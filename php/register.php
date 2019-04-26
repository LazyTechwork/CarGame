<?php

$conn = new PDO('mysql:host=localhost;dbname=results;charset=utf8', 'admin', '123456', [
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

$username = $_POST['username'];
$score = $_POST['score'];
$time = $_POST['time'];

$insert = $conn->prepare('INSERT INTO ranking(username, score, time) VALUES (?, ?, ?)');
$insert->execute([
    $username,
    $score,
    $time
]);

$select = $conn->query('SELECT * FROM ranking');
echo json_encode($select->fetchAll());