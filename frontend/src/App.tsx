import React, { useState } from 'react'

// API configuration
const API_BASE_URL = 'http://localhost:8000/api'

export default function App() {
  const [message, setMessage] = useState<string>(
    'Welcome to Wordle Challenge! Start implementing your game.'
  )

  const testBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-dummy-response.php`)
      const data = await response.json()
      setMessage(`Backend response: ${data.message}`)
    } catch (error) {
      setMessage(
        'Could not connect to backend. Make sure it is running on localhost:8000'
      )
    }
  }

  return (
    <div className='App'>
      <header>
        <h1>🔤 Wordle Team Challenge</h1>
        <p>Hello World! This is your starting template.</p>

        <div>
          <div>{message}</div>

          <div>
            <button onClick={testBackendConnection}>
              Test Backend Connection
            </button>
          </div>
        </div>
      </header>
    </div>
  )
}
