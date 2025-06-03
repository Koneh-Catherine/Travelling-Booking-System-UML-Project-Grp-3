const API_BASE_URL = "http://localhost:8080/api"

// Check authentication and load dashboard data on page load
document.addEventListener("DOMContentLoaded", () => {
  const admin = checkAdminAuth()
  if (admin) {
    updateAdminInfo(admin)
    loadDashboardStats()
    loadRecentBookings()
  }
})

// Function to check admin authentication
function checkAdminAuth() {
  const admin = localStorage.getItem("admin")
  if (!admin) {
    window.location.href = "admin-login.html"
    return null
  }
  return JSON.parse(admin)
}

// Update admin info in sidebar
function updateAdminInfo(admin) {
  document.getElementById("adminName").textContent = admin.fullName || admin.username
  document.getElementById("adminRole").textContent = admin.role || "Administrator"
}

// Load dashboard statistics
async function loadDashboardStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`)
    if (response.ok) {
      const stats = await response.json()
      updateStatsDisplay(stats)
    }
  } catch (error) {
    console.error("Error loading dashboard stats:", error)
  }
}

// Update statistics display
function updateStatsDisplay(stats) {
  document.getElementById("totalUsers").textContent = stats.totalUsers || 0
  document.getElementById("totalBuses").textContent = stats.totalBuses || 0
  document.getElementById("totalBookings").textContent = stats.totalBookings || 0
  document.getElementById("totalAgencies").textContent = stats.totalAgencies || 0
}

// Load recent bookings
async function loadRecentBookings() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/bookings`)
    if (response.ok) {
      const bookings = await response.json()
      displayRecentBookings(bookings.slice(0, 5)) // Show only 5 recent bookings
    }
  } catch (error) {
    console.error("Error loading recent bookings:", error)
  }
}

// Display recent bookings
function displayRecentBookings(bookings) {
  const recentBookings = document.getElementById("recentBookings")

  if (bookings.length === 0) {
    recentBookings.innerHTML = '<p class="no-data">No recent bookings</p>'
    return
  }

  recentBookings.innerHTML = bookings
    .map(
      (booking) => `
        <div class="recent-item">
            <div class="recent-info">
                <span class="recent-title">${booking.ticketNumber}</span>
                <span class="recent-subtitle">${booking.passengerName}</span>
            </div>
            <div class="recent-meta">
                <span class="status-badge ${booking.status.toLowerCase()}">${booking.status}</span>
                <span class="recent-time">${new Date(booking.bookingDate).toLocaleDateString()}</span>
            </div>
        </div>
    `,
    )
    .join("")
}

// Refresh dashboard data
function refreshData() {
  loadDashboardStats()
  loadRecentBookings()
}

// Send bulk emails (placeholder)
function sendBulkEmails() {
  alert("Bulk email functionality would be implemented here")
}

// Generate report (placeholder)
function generateReport() {
  alert("Report generation functionality would be implemented here")
}

// Admin logout
function adminLogout() {
  localStorage.removeItem("admin")
  window.location.href = "admin-login.html"
}
