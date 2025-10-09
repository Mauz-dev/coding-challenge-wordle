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
$randomWord = $_SESSION['word'] ?? '';

if (!$randomWord) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Session corrupt - word not found', 'session status' => session_status()]);
    exit;
}

echo json_encode([
    'status' => 'success',
    'message' => 'foo',
    'word' => $randomWord,
]);