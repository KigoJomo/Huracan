const svg = document.getElementById("mySVG");
const points = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Define polygon points

// Create a polygon element
const polygon = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "polygon"
);
polygon.setAttribute("points", points.join(" "));
polygon.setAttribute("fill", "transparent");
polygon.setAttribute("stroke", "white");
polygon.setAttribute("stroke-width", ".5");

// Append the polygon to the SVG
svg.appendChild(polygon);

// Function to update polygon points dynamically (e.g., on window resize)
function updatePolygon() {
  const newWidth = svg.clientWidth; // Get current SVG width
  const newHeight = svg.clientHeight; // Get current SVG height

  // Update points based on percentages of the new dimensions
  const newPoints = [
    newWidth * 0,
    newHeight * 1,

    newWidth * 1,
    newHeight * 1,

    newWidth * 1,
    newHeight * 0.11,

    newWidth * 0.87,
    newHeight * 0.11,

    newWidth * 0.83,
    newHeight * 0,

    newWidth * 0.09,
    newHeight * 0,

    newWidth * 0.05,
    newHeight * 0.11,

    newWidth * 0, // top left
    newHeight * 0.11,
  ];

  polygon.setAttribute("points", newPoints.join(" "));
}

// Call updatePolygon initially and on window resize
updatePolygon();
window.addEventListener("resize", updatePolygon);
document.addEventListener("DOMContentLoaded", updatePolygon);

let cars = []; // Define cars in a global scope

async function fetchCarData() {
  try {
    const response = await fetch("cars.json");
    cars = await response.json(); // Assign the fetched data to the global cars variable
    console.log("Fetched cars:");
    console.table(cars);

    updateCarData(cars);
    updateIndicators(cars);
  } catch (error) {
    console.error("Error fetching car data:", error);
  }
}

function updateCarData(cars) {
  const carsContainer = document.getElementById("cars-container");

  cars.forEach((car, index) => {
    const carDiv = document.createElement("div");
    carDiv.classList.add("car");
    carDiv.setAttribute("id", `car${index}`)

    carDiv.innerHTML = `
      <div class="car-details">
        <div class="car-detail">
          <h4 class="feature">Top Speed</h4>
          <p class="value">${car.topSpeed}</p>
        </div>
        <div class="car-detail">
          <h4 class="feature">0-60 Mph</h4>
          <p class="value">${car.zeroToSixty}</p>
        </div>
        <div class="car-detail">
          <h4 class="feature">Power</h4>
          <p class="value">${car.power}</p>
        </div>
        <div class="car-detail">
          <h4 class="feature">Engine</h4>
          <p class="value">${car.engine}</p>
        </div>
      </div>
      <div class="desc">
        <h4 class="tagline">${car.tagLine}</h4>
        <p class="description">${car.description}</p>
      </div>
    `;

    carsContainer.appendChild(carDiv);
  });
}

function updateIndicators(cars) {
  const indicators = document.getElementById("indicators");

  cars.forEach((car, index) => {
    const indicator = document.createElement("span");
    indicator.classList.add("indicator");
    if (index === 0) {
      indicator.classList.add("active");
    }
    indicators.appendChild(indicator);
  });
}

let activeIndex = 0;

function handleScroll() {
  const carsContainer = document.getElementById("cars-container");
  const carElements = carsContainer.getElementsByClassName("car");
  const indicators = document
    .getElementById("indicators")
    .getElementsByClassName("indicator");
  const heroSection = document.getElementById("hero");

  for (let i = 0; i < carElements.length; i++) {
    // Get the bounding rectangle of the current car element
    const carRect = carElements[i].getBoundingClientRect();
    const contRect = carsContainer.getBoundingClientRect();

    // Check if the current car element is fully visible within the cars container
    if (carRect.top >= contRect.top && carRect.bottom <= contRect.bottom) {
      // If the car is fully visible, set the active index to the current index
      activeIndex = i;
      // Exit the loop early since we found the first fully visible car
      break;
    }
  }

  // cars.forEach((car, index) => {
  //   const carElement = document.getElementById(`car${index}`);
  //   const carRect = carElement.getBoundingClientRect();
  //   const contRect = carsContainer.getBoundingClientRect();

  //   if (carRect.top >= contRect.top && carRect.bottom <= contRect.bottom) {
  //     activeIndex = index;
  //   }
  // })

  for (let i = 0; i < indicators.length; i++) {
    if (i === activeIndex) {
      indicators[i].classList.add("active");
      const car = cars[activeIndex];
      heroSection.style.background = `url('${car.image}') center/cover no-repeat`;
    } else {
      indicators[i].classList.remove("active");
    }
  }

  console.log(activeIndex);
}

fetchCarData();

document
  .getElementById("cars-container")
  .addEventListener("scroll", handleScroll);
document.querySelectorAll(".scroll-buttons button").forEach((button) => {
  button.addEventListener("click", () => {
    let direction = button.id === "north" ? -1 : 1;

    const carsContainer = document.getElementById("cars-container");
    const scrollAmount = 300; // Adjust scroll amount as needed
    carsContainer.scrollBy({
      left: 0,
      top: direction * scrollAmount,
      behavior: "smooth",
    });
    handleScroll(); // Update indicators and background after scroll
  });
});