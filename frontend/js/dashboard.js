const API_BASE_URL = "http://localhost:8080/api"

// Declare the checkAuth function
function checkAuth() {
  // Placeholder for authentication logic
  return true // Assuming user is authenticated for demonstration purposes
}

// Check authentication on page load
document.addEventListener("DOMContentLoaded", () => {
  const user = checkAuth()
  if (user) {
    loadPopularAgencies()
  }
})

// Handle transport selection
function selectTransport(type) {
  if (type === "bus") {
    window.location.href = "bus-agencies.html"
  } else {
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} transport option is not yet supported.`)
  }
}

// Load popular agencies
async function loadPopularAgencies() {
  try {
    const response = await fetch(`${API_BASE_URL}/agencies`)
    if (response.ok) {
      const agencies = await response.json()
      displayAgencies(agencies.slice(0, 4)) // Show only first 4
    }
  } catch (error) {
    console.error("Error loading agencies:", error)
  }
}

// Display agencies in the grid
function displayAgencies(agencies) {
  const agenciesGrid = document.getElementById("agenciesGrid")
  if (!agenciesGrid) return

  agenciesGrid.innerHTML = agencies
    .map(
      (agency) => `
        <div class="agency-card" onclick="viewAgency(${agency.id})">
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
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// View specific agency
function viewAgency(agencyId) {
  window.location.href = `bus-agencies.html?agency=${agencyId}`
}
