document.addEventListener('DOMContentLoaded', function() {
  // Reference to the table body.
  const tbody = document.getElementById("data-table-body");
  const maxRows = 9; // Maximum number of rows to store/display
  const STORAGE_KEY = 'trafficData';
  let events = [];
  
  // Define the columns in the desired order.
  const columns = [
    "Time",
    "FC1 Read Input Register",
    "FC2 Read Discrete Value",
    "FC3 Read Holding Register",
    "FC4 Read Coil"
  ];
  
  // Load events from localStorage.
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
  
  // Render the table rows based on the current events array.
  function renderTable() {
    tbody.innerHTML = "";
    events.forEach(record => {
      const tr = document.createElement("tr");
      // For each column, create a cell.
      columns.forEach(col => {
        const td = document.createElement("td");
        td.textContent = record[col] !== undefined ? record[col] : '';
        tr.appendChild(td);
      });
      // If the record's prediction is not equal to 2, mark the row with a red background.
      if (record.prediction !== 2) {
        tr.style.backgroundColor = "red";
      }
      tbody.appendChild(tr);
    });
  }
  
  // Save events to localStorage.
  function saveEventsToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }
  
  // Load stored events and render them immediately.
  loadEventsFromStorage();
  renderTable();
  
  // Fetch new data from the Flask endpoint.
  fetch("/modbusModel")
    .then(response => response.json())
    .then(data => {
      // 'rawData' is a JSON string representing an array of row objects.
      const records = JSON.parse(data.rawData);
      // data.type is an array of predictions corresponding to each record.
      
      // Add one row at a time every second.
      let currentRow = 0;
      const interval = setInterval(() => {
        // Stop if we've processed all rows.
        if (currentRow >= records.length) {
          clearInterval(interval);
          // Optionally, trigger a new fetch for continuous updates.
          return;
        }
        
        // Get the current record and update the "Time" field with the current system time.
        let record = records[currentRow];
        record["Time"] = new Date().toLocaleTimeString();
        
        // Attach the prediction value to the record.
        record.prediction = data.type[currentRow];
        
        // Add the new record to the events array.
        events.push(record);
        
        // Enforce the maximum number of rows.
        while (events.length > maxRows) {
          events.shift();
        }
        
        // Save and re-render the table.
        saveEventsToStorage();
        renderTable();
        
        currentRow++;
      }, 1000);
    })
    .catch(error => console.error("Error fetching modbusModel data:", error));
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
