const API_BASE_URL = "http://localhost:8080/api"

// Check authentication and load bookings on page load
document.addEventListener("DOMContentLoaded", () => {
  const admin = checkAdminAuth()
  if (admin) {
    loadAllBookings()
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

// Load all bookings
async function loadAllBookings() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/bookings`)
    if (response.ok) {
      const bookings = await response.json()
      displayBookingsTable(bookings)
    } else {
      throw new Error("Failed to load bookings")
    }
  } catch (error) {
    console.error("Error loading bookings:", error)
    document.getElementById("bookingsTableBody").innerHTML =
      '<tr><td colspan="8" class="error">Failed to load bookings. Please try again.</td></tr>'
  }
}

// Display bookings in table
function displayBookingsTable(bookings) {
  const tableBody = document.getElementById("bookingsTableBody")

  if (bookings.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8" class="no-data">No bookings found</td></tr>'
    return
  }

  tableBody.innerHTML = bookings
    .map(
      (booking) => `
        <tr data-status="${booking.status}">
            <td>${booking.ticketNumber}</td>
            <td>
                <div class="passenger-info">
                    <strong>${booking.passengerName}</strong>
                    <small>${booking.phoneNumber}</small>
                </div>
            </td>
            <td>${booking.bus.currentLocation} → ${booking.bus.destination}</td>
            <td>${booking.bus.busNumber}</td>
            <td>${new Date(booking.bookingDate).toLocaleDateString()}</td>
            <td>
                <span class="status-badge ${booking.status.toLowerCase()}">${booking.status}</span>
            </td>
            <td>${booking.totalPrice.toLocaleString()} CFA</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline" onclick="viewBookingDetails(${booking.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${
                      booking.status === "CONFIRMED"
                        ? `
                        <button class="btn btn-sm btn-danger" onclick="cancelBookingAdmin(${booking.id})" title="Cancel Booking">
                            <i class="fas fa-times"></i>
                        </button>
                    `
                        : ""
                    }
                    <button class="btn btn-sm btn-secondary" onclick="sendEmailReminder(${booking.id})" title="Send Email">
                        <i class="fas fa-envelope"></i>
                    </button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

// Filter bookings by status
function filterBookings() {
  const statusFilter = document.getElementById("statusFilter").value
  const rows = document.querySelectorAll("#bookingsTableBody tr")

  rows.forEach((row) => {
    const rowStatus = row.getAttribute("data-status")
    if (!statusFilter || rowStatus === statusFilter) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })
}

// Search bookings
function searchBookings() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  const rows = document.querySelectorAll("#bookingsTableBody tr")

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase()
    if (text.includes(searchTerm)) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })
}

// View booking details (placeholder)
function viewBookingDetails(bookingId) {
  alert(`Viewing details for booking ID: ${bookingId}`)
}

// Cancel booking as admin
async function cancelBookingAdmin(bookingId) {
  if (!confirm("Are you sure you want to cancel this booking?")) {
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/cancel`, {
      method: "POST",
    })

    if (response.ok) {
      alert("Booking cancelled successfully")
      loadAllBookings() // Reload the table
    } else {
      const error = await response.json()
      alert("Failed to cancel booking: " + error.message)
    }
  } catch (error) {
    console.error("Error cancelling booking:", error)
    alert("Failed to cancel booking. Please try again.")
  }
}

// Send email reminder (placeholder)
function sendEmailReminder(bookingId) {
  alert(`Sending email reminder for booking ID: ${bookingId}`)
}

// Admin logout
function adminLogout() {
  localStorage.removeItem("admin")
  window.location.href = "admin-login.html"
}
