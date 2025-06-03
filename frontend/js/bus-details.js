const API_BASE_URL = "http://localhost:8080/api"

// Function to check authentication
function checkAuth() {
  // Placeholder for authentication check logic
  console.log("Checking authentication...")
}

// Check authentication and load bus details on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAuth()
  loadBusDetails()
})

// Load bus details from URL parameters
async function loadBusDetails() {
  const urlParams = new URLSearchParams(window.location.search)
  const agencyId = urlParams.get("agency")
  const busId = urlParams.get("bus")

  if (!busId) {
    document.getElementById("busInfo").innerHTML = '<div class="error">Bus ID not found in URL</div>'
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/buses/${busId}`)
    if (response.ok) {
      const bus = await response.json()
      displayBusDetails(bus)
      displayReservationForm(bus)
    } else {
      throw new Error("Failed to load bus details")
    }
  } catch (error) {
    console.error("Error loading bus details:", error)
    document.getElementById("busInfo").innerHTML =
      '<div class="error">Failed to load bus details. Please try again.</div>'
  }
}

// Display bus information
function displayBusDetails(bus) {
  const busInfo = document.getElementById("busInfo")

  busInfo.innerHTML = `
        <div class="bus-image">
            <i class="fas fa-bus"></i>
        </div>
        <div class="bus-details">
            <div class="bus-header">
                <div>
                    <h2 class="bus-title">${bus.destination}</h2>
                    <span class="bus-number">${bus.busNumber}</span>
                </div>
                <div class="text-right">
                    <div class="bus-price">${bus.price.toLocaleString()} CFA</div>
                    <div class="price-label">per seat</div>
                </div>
            </div>
            
            <div class="bus-route">
                <i class="fas fa-map-marker-alt"></i>
                From: ${bus.currentLocation}
            </div>
            
            <div class="detail-section">
                <h3>Schedule</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>Departure: ${bus.departureTime}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>Arrival: ${bus.arrivalTime}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Driver Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <span>Name: ${bus.driver ? bus.driver.name : "N/A"}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <span>Age: ${bus.driver ? bus.driver.age : "N/A"} years</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Seat Availability</h3>
                <div class="seat-info">
                    ${bus.availableSeats} / ${bus.totalSeats} seats available
                </div>
            </div>
        </div>
    `
}

// Display reservation form
function displayReservationForm(bus) {
  const reservationCard = document.getElementById("reservationCard")

  reservationCard.innerHTML = `
        <h3>Reserve Your Seat</h3>
        <div class="price-breakdown">
            <div class="price-item">
                <span>Price per seat:</span>
                <span>${bus.price.toLocaleString()} CFA</span>
            </div>
            <div class="price-item">
                <span>Available seats:</span>
                <span>${bus.availableSeats} / ${bus.totalSeats}</span>
            </div>
        </div>
        
        ${
          bus.availableSeats > 0
            ? `
            <form id="reservationForm" onsubmit="handleReservation(event, ${bus.id}, ${bus.price})">
                <div class="form-group">
                    <label for="passengerName">Full Name (as on ID)</label>
                    <input type="text" id="passengerName" name="passengerName" required>
                </div>
                
                <div class="form-group">
                    <label for="idNumber">ID Card Number</label>
                    <input type="text" id="idNumber" name="idNumber" required>
                </div>
                
                <div class="form-group">
                    <label for="seatNumber">Preferred Seat Number</label>
                    <input type="number" id="seatNumber" name="seatNumber" min="1" max="${bus.totalSeats}" required>
                </div>
                
                <div class="form-group">
                    <label for="phoneNumber">Phone Number</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" required>
                </div>
                
                <div class="form-group">
                    <label for="numberOfSeats">Number of Seats</label>
                    <input type="number" id="numberOfSeats" name="numberOfSeats" min="1" max="${Math.min(bus.availableSeats, 5)}" value="1" onchange="updateTotalPrice(${bus.price})" required>
                </div>
                
                <div class="price-total">
                    <span>Total Cost:</span>
                    <span id="totalPrice">${bus.price.toLocaleString()} CFA</span>
                </div>
                
                <button type="submit" class="btn btn-primary btn-full">
                    Proceed to Payment
                </button>
            </form>
        `
            : `
            <button class="btn btn-primary btn-full" disabled>
                Fully Booked
            </button>
        `
        }
    `
}

// Update total price when number of seats changes
function updateTotalPrice(pricePerSeat) {
  const numberOfSeats = document.getElementById("numberOfSeats").value
  const totalPrice = pricePerSeat * Number.parseInt(numberOfSeats)
  document.getElementById("totalPrice").textContent = totalPrice.toLocaleString() + " CFA"
}

// Handle reservation form submission
async function handleReservation(event, busId, pricePerSeat) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const user = JSON.parse(localStorage.getItem("user"))

  const reservationData = {
    userId: user.id,
    busId: busId,
    seatNumber: Number.parseInt(formData.get("seatNumber")),
    numberOfSeats: Number.parseInt(formData.get("numberOfSeats")),
    passengerName: formData.get("passengerName"),
    idNumber: formData.get("idNumber"),
    phoneNumber: formData.get("phoneNumber"),
    totalPrice: pricePerSeat * Number.parseInt(formData.get("numberOfSeats")),
  }

  // Store reservation data for payment page
  localStorage.setItem("reservationData", JSON.stringify(reservationData))

  // Redirect to payment page
  window.location.href = "payment.html"
}

// Go back to previous page
function goBack() {
  window.history.back()
}
