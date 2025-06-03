const API_BASE_URL = "http://localhost:8080/api"

// Handle user registration
async function handleRegister(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const userData = {
    name: formData.get("fullName"),
    email: formData.get("email"),
    contact: formData.get("contact"),
    password: formData.get("password"),
    country: formData.get("country"),
    city: formData.get("city"),
    age: Number.parseInt(formData.get("age")),
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (response.ok) {
      const result = await response.json()
      localStorage.setItem("user", JSON.stringify(result))
      window.location.href = "dashboard.html"
    } else {
      const error = await response.json()
      alert("Registration failed: " + error.message)
    }
  } catch (error) {
    console.error("Error:", error)
    alert("Registration failed. Please try again.")
  }
}

// Handle user login
async function handleLogin(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })

    if (response.ok) {
      const result = await response.json()
      localStorage.setItem("user", JSON.stringify(result))
      window.location.href = "dashboard.html"
    } else {
      const error = await response.json()
      alert("Login failed: " + error.message)
    }
  } catch (error) {
    console.error("Error:", error)
    alert("Login failed. Please try again.")
  }
}

// Handle Google authentication (placeholder)
function handleGoogleAuth() {
  // In a real implementation, this would integrate with Google OAuth
  alert("Google authentication would be integrated here")
}

// Logout function
function logout() {
  localStorage.removeItem("user")
  window.location.href = "index.html"
}

// Check if user is authenticated
function checkAuth() {
  const user = localStorage.getItem("user")
  if (
    !user &&
    !window.location.pathname.includes("login") &&
    !window.location.pathname.includes("register") &&
    !window.location.pathname.includes("index")
  ) {
    window.location.href = "login.html"
  }
  return user ? JSON.parse(user) : null
}
