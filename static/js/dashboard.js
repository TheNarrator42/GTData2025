document.addEventListener('DOMContentLoaded', function() {
  const tableBody = document.querySelector('#trafficTable tbody');
  const maxRows = 9; // Maximum number of rows to store/display
  const STORAGE_KEY = 'trafficData';
  let events = [];

  // Load events from localStorage
  function loadEventsFromStorage() {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    if (storedEvents) {
      try {
        events = JSON.parse(storedEvents);
      } catch (e) {
        console.error("Error parsing stored events:", e);
        events = [];
      }
    }
  }

  // Save events to localStorage
  function saveEventsToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }

  // Render the events array into the table
  function renderTable() {
    tableBody.innerHTML = '';
    // Iterate over events and append each as a table row
    events.forEach(event => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${event.time}</td>
        <td>${event.device}</td>
        <td>${event.sensorType}</td>
        <td>${event.value}</td>
      `;
      tableBody.appendChild(newRow);
    });
  }

  // Sample arrays for device IDs and sensor types
  const deviceIds = ["Device-1", "Device-2", "Device-3", "Device-4", "Device-5"];
  const sensorTypes = ["Temperature", "Humidity", "Light", "Motion"];

  // Function to generate a random sensor value based on type
  function generateRandomValue(sensorType) {
    switch(sensorType) {
      case "Temperature":
        return (Math.random() * 15 + 15).toFixed(2) + " °C";
      case "Humidity":
        return (Math.random() * 40 + 30).toFixed(2) + " %";
      case "Light":
        return Math.floor(Math.random() * 1000) + " lx";
      case "Motion":
        return Math.random() > 0.5 ? "Motion Detected" : "No Motion";
      default:
        return "N/A";
    }
  }

  // Function to add a new simulated IoT event
  function addTrafficEvent() {
    const now = new Date();
    const time = now.toLocaleTimeString();
    //Change this line of code
	const device = deviceIds[Math.floor(Math.random() * deviceIds.length)];
    const sensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
    const value = generateRandomValue(sensorType);

    // Create the event object
    const event = { time, device, sensorType, value };

    // Insert the new event at the beginning of the array
    events.unshift(event);

    // If we exceed the max allowed rows, remove the oldest event
    if (events.length > maxRows) {
      events.pop();
    }

    // Update storage and render the table
    saveEventsToStorage();
    renderTable();
  }

  // On page load, load stored events and render them
  loadEventsFromStorage();
  renderTable();

  // Generate a new event every second
  setInterval(addTrafficEvent, 1000);
});

// Function to update the time display
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById('time').textContent = timeString;
}

// Display the time immediately and then update every second
updateTime();
setInterval(updateTime, 1000);
