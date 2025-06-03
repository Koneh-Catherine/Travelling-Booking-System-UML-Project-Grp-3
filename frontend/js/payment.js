const API_BASE_URL = "http://localhost:8080/api"

// Function to check authentication
function checkAuth() {
  // Placeholder for authentication check logic
  console.log("Checking authentication...")
}

// Check authentication and load payment details on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAuth()
  loadPaymentDetails()
})

// Load payment details from localStorage
function loadPaymentDetails() {
  const reservationData = localStorage.getItem("reservationData")

  if (!reservationData) {
    alert("No reservation data found. Please start booking again.")
    window.location.href = "dashboard.html"
    return
  }

  const booking = JSON.parse(reservationData)
  displayBookingSummary(booking)

  // Set amount in payment form
  document.getElementById("amount").value = booking.totalPrice
}

// Display booking summary
async function displayBookingSummary(booking) {
  try {
    // Fetch bus details
    const busResponse = await fetch(`${API_BASE_URL}/buses/${booking.busId}`)
    const bus = await busResponse.json()

    const bookingSummary = document.getElementById("bookingSummary")

    bookingSummary.innerHTML = `
            <h2>Booking Summary</h2>
            
            <div class="summary-section">
                <h4>Trip Details</h4>
                <div class="summary-item">
                    <span>Route:</span>
                    <span>${bus.currentLocation} → ${bus.destination}</span>
                </div>
                <div class="summary-item">
                    <span>Bus Number:</span>
                    <span>${bus.busNumber}</span>
                </div>
                <div class="summary-item">
                    <span>Departure:</span>
                    <span>${bus.departureTime}</span>
                </div>
                <div class="summary-item">
                    <span>Arrival:</span>
                    <span>${bus.arrivalTime}</span>
                </div>
            </div>
            
            <div class="summary-section">
                <h4>Passenger Details</h4>
                <div class="summary-item">
                    <span>Name:</span>
                    <span>${booking.passengerName}</span>
                </div>
                <div class="summary-item">
                    <span>ID Number:</span>
                    <span>${booking.idNumber}</span>
                </div>
                <div class="summary-item">
                    <span>Phone:</span>
                    <span>${booking.phoneNumber}</span>
                </div>
                <div class="summary-item">
                    <span>Seat Number:</span>
                    <span>${booking.seatNumber}</span>
                </div>
                <div class="summary-item">
                    <span>Number of Seats:</span>
                    <span>${booking.numberOfSeats}</span>
                </div>
            </div>
            
            <div class="summary-section">
                <h4>Payment Details</h4>
                <div class="summary-item">
                    <span>Price per seat:</span>
                    <span>${bus.price.toLocaleString()} CFA</span>
                </div>
                <div class="summary-item">
                    <span>Number of seats:</span>
                    <span>${booking.numberOfSeats}</span>
                </div>
                <div class="summary-item total">
                    <span><strong>Total Amount:</strong></span>
                    <span><strong>${booking.totalPrice.toLocaleString()} CFA</strong></span>
                </div>
            </div>
        `
  } catch (error) {
    console.error("Error loading booking summary:", error)
    document.getElementById("bookingSummary").innerHTML = '<div class="error">Failed to load booking summary</div>'
  }
}

// Select payment method
function selectPaymentMethod(method) {
  document.querySelectorAll(".payment-option").forEach((option) => {
    option.classList.remove("active")
  })

  event.target.closest(".payment-option").classList.add("active")
}

// Process payment
async function processPayment(event) {
  event.preventDefault()

  const reservationData = JSON.parse(localStorage.getItem("reservationData"))
  const phoneNumber = document.getElementById("phoneNumber").value

  try {
    // Create booking in backend
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    })

    if (response.ok) {
      const booking = await response.json()

      // Simulate payment processing
      setTimeout(() => {
        // Confirm booking
        confirmBooking(booking.id)
      }, 2000)

      // Show loading state
      event.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...'
      event.target.disabled = true
    } else {
      const error = await response.json()
      alert("Booking failed: " + error.message)
    }
  } catch (error) {
    console.error("Error processing payment:", error)
    alert("Payment failed. Please try again.")
  }
}

// Confirm booking and redirect to ticket
async function confirmBooking(bookingId) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/confirm`, {
      method: "POST",
    })

    if (response.ok) {
      const confirmedBooking = await response.json()

      // Store ticket data and redirect
      localStorage.setItem("ticketData", JSON.stringify(confirmedBooking))
      localStorage.removeItem("reservationData") // Clean up

      window.location.href = "ticket.html"
    } else {
      throw new Error("Failed to confirm booking")
    }
  } catch (error) {
    console.error("Error confirming booking:", error)
    alert("Booking confirmation failed. Please contact support.")
  }
}
