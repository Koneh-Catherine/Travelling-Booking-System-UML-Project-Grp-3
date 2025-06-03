const API_BASE_URL = "http://localhost:8080/api"

// Declare the checkAuth function
function checkAuth() {
  // Placeholder for authentication check logic
  console.log("Checking authentication...")
}

// Check authentication and load agencies on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAuth()
  loadAgencies()
})

// Load all agencies
async function loadAgencies() {
  try {
    const response = await fetch(`${API_BASE_URL}/agencies`)
    if (response.ok) {
      const agencies = await response.json()
      displayAgenciesList(agencies)
    }
  } catch (error) {
    console.error("Error loading agencies:", error)
    document.getElementById("agenciesList").innerHTML =
      '<div class="error">Failed to load agencies. Please try again.</div>'
  }
}

// Display agencies list
function displayAgenciesList(agencies) {
  const agenciesList = document.getElementById("agenciesList")

  agenciesList.innerHTML = agencies
    .map(
      (agency) => `
        <div class="agency-card" onclick="viewAgencyBuses(${agency.id})">
            <div class="agency-image">
                <i class="fas fa-bus"></i>
            </div>
            <div class="agency-info">
                <div class="agency-header">
                    <div>
                        <div class="agency-name">${agency.name}</div>
                        <div class="agency-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${agency.location}
                        </div>
                    </div>
                    <div class="agency-rating">4.5 ★</div>
                </div>
                <div class="agency-footer">
                    <span class="bus-count">12 buses available</span>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); viewAgencyBuses(${agency.id})">
                        View Buses
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Search agencies
function searchAgencies() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  const agencyCards = document.querySelectorAll(".agency-card")

  agencyCards.forEach((card) => {
    const agencyName = card.querySelector(".agency-name").textContent.toLowerCase()
    const agencyLocation = card.querySelector(".agency-location").textContent.toLowerCase()

    if (agencyName.includes(searchTerm) || agencyLocation.includes(searchTerm)) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

// View agency buses
function viewAgencyBuses(agencyId) {
  window.location.href = `bus-details.html?agency=${agencyId}`
}
