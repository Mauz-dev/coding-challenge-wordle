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

// DUMMY RESPONSE 
echo json_encode([
    'status' => 'success',
    'message' => 'This is just a dummy response. Create your own API endpoint to return real data.',
]);

?>