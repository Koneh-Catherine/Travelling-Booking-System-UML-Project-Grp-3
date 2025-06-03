const API_BASE_URL = "http://localhost:8080/api"

// Check authentication and load bookings on page load
document.addEventListener("DOMContentLoaded", () => {
  const user = checkAuth()
  if (user) {
    loadUserBookings(user.id)
  }
})

// Function to check authentication
function checkAuth() {
  const user = localStorage.getItem("user")
  if (!user) {
    window.location.href = "login.html"
    return null
  }
  return JSON.parse(user)
}

// Load user bookings
async function loadUserBookings(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`)
    if (response.ok) {
      const bookings = await response.json()
      displayBookings(bookings)
      updateBookingStats(bookings)
    } else {
      throw new Error("Failed to load bookings")
    }
  } catch (error) {
    console.error("Error loading bookings:", error)
    document.getElementById("bookingsList").innerHTML =
      '<div class="error">Failed to load bookings. Please try again.</div>'
  }
}

// Display bookings
function displayBookings(bookings) {
  const bookingsList = document.getElementById("bookingsList")
  const emptyState = document.getElementById("emptyState")

  if (bookings.length === 0) {
    bookingsList.style.display = "none"
    emptyState.style.display = "block"
    return
  }

  bookingsList.style.display = "block"
  emptyState.style.display = "none"

  bookingsList.innerHTML = bookings
    .map(
      (booking) => `
        <div class="booking-card" data-status="${booking.status}">
            <div class="booking-header">
                <div class="booking-info">
                    <h3>${booking.bus.currentLocation} → ${booking.bus.destination}</h3>
                    <p class="ticket-number">Ticket: ${booking.ticketNumber}</p>
                </div>
                <div class="booking-status">
                    <span class="status-badge ${booking.status.toLowerCase()}">${booking.status}</span>
                </div>
            </div>
            
            <div class="booking-details">
                <div class="detail-row">
                    <div class="detail-item">
                        <i class="fas fa-bus"></i>
                        <span>Bus: ${booking.bus.busNumber}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>Departure: ${booking.bus.departureTime}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-chair"></i>
                        <span>Seat: ${booking.seatNumber}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-money-bill"></i>
                        <span>${booking.totalPrice.toLocaleString()} CFA</span>
                    </div>
                </div>
                
                <div class="booking-date">
                    <i class="fas fa-calendar"></i>
                    <span>Booked on: ${new Date(booking.bookingDate).toLocaleDateString()}</span>
                </div>
            </div>
            
            <div class="booking-actions">
                <button class="btn btn-outline btn-sm" onclick="viewBookingDetails(${booking.id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
                ${
                  booking.status === "CONFIRMED" || booking.status === "PENDING"
                    ? `
                    <button class="btn btn-secondary btn-sm" onclick="downloadTicket('${booking.ticketNumber}')">
                        <i class="fas fa-download"></i> Download Ticket
                    </button>
                    ${
                      booking.status === "CONFIRMED"
                        ? `
                        <button class="btn btn-danger btn-sm" onclick="cancelBooking(${booking.id})">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    `
                        : ""
                    }
                `
                    : ""
                }
            </div>
        </div>
    `,
    )
    .join("")
}

// Update booking statistics
function updateBookingStats(bookings) {
  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED").length
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED").length

  document.getElementById("totalBookings").textContent = totalBookings
  document.getElementById("confirmedBookings").textContent = confirmedBookings
  document.getElementById("pendingBookings").textContent = pendingBookings
  document.getElementById("cancelledBookings").textContent = cancelledBookings
}

// Filter bookings by status
function filterBookings() {
  const statusFilter = document.getElementById("statusFilter").value
  const bookingCards = document.querySelectorAll(".booking-card")

  bookingCards.forEach((card) => {
    const cardStatus = card.getAttribute("data-status")
    if (!statusFilter || cardStatus === statusFilter) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

// View booking details in modal
async function viewBookingDetails(bookingId) {
  try {
    const user = JSON.parse(localStorage.getItem("user"))
    const response = await fetch(`${API_BASE_URL}/bookings/user/${user.id}`)
    const bookings = await response.json()
    const booking = bookings.find((b) => b.id === bookingId)

    if (booking) {
      showBookingModal(booking)
    }
  } catch (error) {
    console.error("Error loading booking details:", error)
    alert("Failed to load booking details")
  }
}

// Show booking details modal
function showBookingModal(booking) {
  const modal = document.getElementById("bookingModal")
  const modalBody = document.getElementById("modalBody")

  modalBody.innerHTML = `
        <div class="booking-detail-modal">
            <div class="detail-section">
                <h4>Trip Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Route:</label>
                        <span>${booking.bus.currentLocation} → ${booking.bus.destination}</span>
                    </div>
                    <div class="detail-item">
                        <label>Bus Number:</label>
                        <span>${booking.bus.busNumber}</span>
                    </div>
                    <div class="detail-item">
                        <label>Departure Time:</label>
                        <span>${booking.bus.departureTime}</span>
                    </div>
                    <div class="detail-item">
                        <label>Arrival Time:</label>
                        <span>${booking.bus.arrivalTime}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Passenger Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Name:</label>
                        <span>${booking.passengerName}</span>
                    </div>
                    <div class="detail-item">
                        <label>ID Number:</label>
                        <span>${booking.idNumber}</span>
                    </div>
                    <div class="detail-item">
                        <label>Phone:</label>
                        <span>${booking.phoneNumber}</span>
                    </div>
                    <div class="detail-item">
                        <label>Seat Number:</label>
                        <span>${booking.seatNumber}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Booking Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Ticket Number:</label>
                        <span>${booking.ticketNumber}</span>
                    </div>
                    <div class="detail-item">
                        <label>Booking Date:</label>
                        <span>${new Date(booking.bookingDate).toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <label>Status:</label>
                        <span class="status-badge ${booking.status.toLowerCase()}">${booking.status}</span>
                    </div>
                    <div class="detail-item">
                        <label>Total Amount:</label>
                        <span class="amount">${booking.totalPrice.toLocaleString()} CFA</span>
                    </div>
                </div>
            </div>
        </div>
    `

  modal.style.display = "block"
}

// Close modal
function closeModal() {
  document.getElementById("bookingModal").style.display = "none"
}

// Cancel booking
async function cancelBooking(bookingId) {
  if (!confirm("Are you sure you want to cancel this booking?")) {
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: "POST",
    })

    if (response.ok) {
      alert("Booking cancelled successfully")
      // Reload bookings
      const user = JSON.parse(localStorage.getItem("user"))
      loadUserBookings(user.id)
    } else {
      const error = await response.json()
      alert("Failed to cancel booking: " + error.message)
    }
  } catch (error) {
    console.error("Error cancelling booking:", error)
    alert("Failed to cancel booking. Please try again.")
  }
}

// Download ticket
function downloadTicket(ticketNumber) {
  // This would generate and download the ticket
  alert(`Downloading ticket ${ticketNumber}...`)
}

// Logout function
function logout() {
  localStorage.removeItem("user")
  window.location.href = "index.html"
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("bookingModal")
  if (event.target === modal) {
    closeModal()
  }
}
