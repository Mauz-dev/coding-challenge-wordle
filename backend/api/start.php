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

$wordsFile = __DIR__ . '/words.txt';
if (!file_exists($wordsFile)) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'words.txt not found']);
    exit;
}

$words = file($wordsFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
if (!$words) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'No words found']);
    exit;
}

$randomWord = strtoupper($words[array_rand($words)]);
$_SESSION['word'] = $randomWord;

echo json_encode([
    'status' => 'success',
    'message' => 'Session started, word stored in session',
    'word' => $randomWord,
]);