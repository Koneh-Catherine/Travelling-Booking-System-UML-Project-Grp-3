const API_BASE_URL = "http://localhost:8080/api"

// Load ticket details on page load
document.addEventListener("DOMContentLoaded", () => {
  loadTicketDetails()
})

// Load and display ticket details
async function loadTicketDetails() {
  const ticketData = localStorage.getItem("ticketData")

  if (!ticketData) {
    alert("No ticket data found.")
    window.location.href = "dashboard.html"
    return
  }

  const booking = JSON.parse(ticketData)

  try {
    // Fetch bus details
    const busResponse = await fetch(`${API_BASE_URL}/buses/${booking.bus.id}`)
    const bus = await busResponse.json()

    displayTicket(booking, bus)
  } catch (error) {
    console.error("Error loading ticket details:", error)
    displayTicket(booking, booking.bus)
  }
}

// Display the ticket
function displayTicket(booking, bus) {
  const ticket = document.getElementById("ticket")

  ticket.innerHTML = `
        <div class="ticket-header">
            <h1><i class="fas fa-ticket-alt"></i> TravelEase</h1>
            <h2>Bus Ticket</h2>
            <p>Ticket #${booking.ticketNumber}</p>
        </div>
        
        <div class="ticket-body">
            <div class="ticket-info">
                <div class="info-section">
                    <h4>Passenger Information</h4>
                    <p><strong>${booking.passengerName}</strong></p>
                    <p>ID: ${booking.idNumber}</p>
                    <p>Phone: ${booking.phoneNumber}</p>
                </div>
                
                <div class="info-section">
                    <h4>Journey Details</h4>
                    <p><strong>${bus.currentLocation} → ${bus.destination}</strong></p>
                    <p>Bus: ${bus.busNumber}</p>
                    <p>Agency: ${bus.agency ? bus.agency.name : "N/A"}</p>
                </div>
                
                <div class="info-section">
                    <h4>Schedule</h4>
                    <p>Departure: ${bus.departureTime}</p>
                    <p>Arrival: ${bus.arrivalTime}</p>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
                
                <div class="info-section">
                    <h4>Seat Information</h4>
                    <p>Seat Number: <strong>${booking.seatNumber}</strong></p>
                    <p>Number of Seats: ${booking.numberOfSeats}</p>
                    <p>Total Paid: <strong>${booking.totalPrice.toLocaleString()} CFA</strong></p>
                </div>
            </div>
            
            <div class="ticket-qr">
                <div class="qr-code">
                    <i class="fas fa-qrcode"></i>
                </div>
                <p>Show this QR code when boarding</p>
                <p><small>Booking Status: ${booking.status}</small></p>
            </div>
        </div>
    `
}

// Download ticket as HTML file
function downloadTicket() {
  const ticketElement = document.getElementById("ticket")
  const ticketHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>TravelEase Ticket</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .ticket { background: white; border: 2px solid #333; border-radius: 10px; padding: 20px; max-width: 600px; margin: 0 auto; }
                .ticket-header { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; margin: -20px -20px 20px -20px; border-radius: 8px 8px 0 0; }
                .ticket-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                .info-section h4 { color: #667eea; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                .ticket-qr { text-align: center; border-top: 2px dashed #ccc; padding-top: 20px; }
                .qr-code { width: 100px; height: 100px; border: 2px solid #ddd; display: inline-flex; align-items: center; justify-content: center; font-size: 30px; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            ${ticketElement.outerHTML}
        </body>
        </html>
    `

  const blob = new Blob([ticketHTML], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `TravelEase_Ticket_${JSON.parse(localStorage.getItem("ticketData")).ticketNumber}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Print ticket
function printTicket() {
  window.print()
}
