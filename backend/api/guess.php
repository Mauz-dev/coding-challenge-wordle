<?php
// Enable CORS for cross-origin requests (React dev server)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit(0);
}

define('MAX_TRIES', 6);

session_start();

$randomWord = $_SESSION['word'] ?? 'apple';

// Initialize session variables if they don't exist
if (!isset($_SESSION['guessCount'])) {
    $_SESSION['guessCount'] = 0;
}
if (!isset($_SESSION['results'])) {
    $_SESSION['results'] = [];
}

/* if (!$randomWord || !isset($_SESSION['guessCount']) || !isset($_SESSION['results'])) {
    http_response_code(500);
    echo json_encode([
        'status'     => 'error',
        'message'    => 'Session corrupt - word not found',
        'guessCount' => $_SESSION['guessCount'] ?? 0,
        'results'    => $_SESSION['results'] ?? [],
    ]);
    exit;
} */

$guess = strtoupper($_GET['guess'] ?? '');

if(!preg_match('/^[A-Z]{5}$/', $guess)) {
    http_response_code(400);
    echo json_encode([
        'status'     => 'error',
        'message'    => 'Invalid guess - use only 5 letters A-Z',
        'guess'      => $guess,
        'guessCount' => $_SESSION['guessCount'],
        'results'    => $_SESSION['results'],
    ]);
    exit;
}

// Load word list for validation
$wordsFile = __DIR__ . '/words.txt';
if (file_exists($wordsFile)) {
    $validWords = array_map('strtoupper', file($wordsFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES));
    if (!in_array($guess, $validWords)) {
        http_response_code(400);
        echo json_encode([
            'status'     => 'error',
            'message'    => 'Not in word list',
            'guess'      => $guess,
            'guessCount' => $_SESSION['guessCount'],
            'results'    => $_SESSION['results'],
        ]);
        exit;
    }
}

// Check if max tries exceeded BEFORE incrementing
if ($_SESSION['guessCount'] >= MAX_TRIES) {
    http_response_code(400);
    echo json_encode([
        'status'     => 'error',
        'message'    => 'Game Over - maximum number of guesses exceeded',
        'word'       => $randomWord,
        'guessCount' => $_SESSION['guessCount'],
        'results'    => $_SESSION['results'],
    ]);
    exit;
}

// Now increment the guess count
$_SESSION['guessCount']++;

$result = [];
$guessArray = str_split($guess);
$wordArray = str_split($randomWord);
$letterCounts = array_count_values($wordArray);

// First pass: mark correct letters
foreach ($guessArray as $i => $letter) {
    if ($letter === $wordArray[$i]) {
        $result[$i+1] = 'correct';
        $letterCounts[$letter]--;
    } else {
        $result[$i+1] = null; // placeholder
    }
}

// Second pass: mark present and absent letters
foreach ($guessArray as $i => $letter) {
    if ($result[$i+1] === null) { // not already marked as correct
        if (isset($letterCounts[$letter]) && $letterCounts[$letter] > 0) {
            $result[$i+1] = 'present';
            $letterCounts[$letter]--;
        } else {
            $result[$i+1] = 'absent';
        }
    }
}

$_SESSION['results'][] = [
    'guess'  => $guess,
    'result' => $result,
];

echo json_encode([
    'status'     => 'success',
    'message'    => $guess === $randomWord ? 'Correct! You guessed the word!' : 'Guess recorded - ' . (MAX_TRIES - $_SESSION['guessCount']) . ' tries left',
    'word'       => $randomWord,
    'guess'      => $guess,
    'guessCount' => $_SESSION['guessCount'],
    'results'    => $_SESSION['results'],
]);