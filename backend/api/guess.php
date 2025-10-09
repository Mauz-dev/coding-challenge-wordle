<?php
// Enable CORS for cross-origin requests (React dev server)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

session_start();

if (++$_SESSION['guessCount'] > 6) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Game Over - maximum number of guesses exceeded']);
    exit;
}

$randomWord = $_SESSION['word'] ?? '';

if (!$randomWord) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Session corrupt - word not found', 'session status' => session_status()]);
    exit;
}

$guess = strtoupper($_GET['guess']) ?? '';

if(!preg_match('/^[A-Z]{5}$/', $guess)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid guess']);
    exit;
}

$result = [];
foreach (str_split($guess) as $i => $letter) {
    if ($letter === $randomWord[$i]) {
        $result[$i+1] = 'correct';
    } elseif (str_contains($randomWord, $letter)) {
        $result[$i+1] = 'present';
    } else {
        $result[$i+1] = 'absent';
    }
}

echo json_encode([
    'status' => 'success',
    'message' => $guess == $randomWord ? 'Correct! You guessed the word!' : 'Guess recorded',
    'word' => $randomWord,
    'guess' => $guess,
    'guessCount' => $_SESSION['guessCount'],
    'result' => json_encode($result),
]);