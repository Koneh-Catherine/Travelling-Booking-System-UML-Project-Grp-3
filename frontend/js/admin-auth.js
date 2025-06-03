const API_BASE_URL = "http://localhost:8080/api"

// Handle admin login
async function handleAdminLogin(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const loginData = {
    username: formData.get("username"),
    password: formData.get("password"),
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })

    if (response.ok) {
      const admin = await response.json()
      localStorage.setItem("admin", JSON.stringify(admin))
      window.location.href = "admin-dashboard.html"
    } else {
      const error = await response.json()
      alert("Login failed: " + error.message)
    }
  } catch (error) {
    console.error("Error:", error)
    alert("Login failed. Please try again.")
  }
}

// Check admin authentication
function checkAdminAuth() {
  const admin = localStorage.getItem("admin")
  if (!admin && !window.location.pathname.includes("admin-login")) {
    window.location.href = "admin-login.html"
    return null
  }
  return admin ? JSON.parse(admin) : null
}

// Admin logout
function adminLogout() {
  localStorage.removeItem("admin")
  window.location.href = "admin-login.html"
}
