document.addEventListener('DOMContentLoaded', function() {
  // Reference to the table body.
  const tbody = document.getElementById("data-table-body");
  const maxRows = 9; // Maximum number of rows to display
  const STORAGE_KEY = 'trafficData';
  const ALERTS_KEY = 'alertData';
  let events = [];
  let alerts = [];
  
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
  
  // Load alerts from localStorage.
  function loadAlertsFromStorage() {
    const storedAlerts = localStorage.getItem(ALERTS_KEY);
    if (storedAlerts) {
      try {
        alerts = JSON.parse(storedAlerts);
      } catch (e) {
        console.error("Error parsing stored alerts:", e);
        alerts = [];
      }
    }
  }
  
  // Render the table rows based on the current events array.
  function renderTable() {
    tbody.innerHTML = "";
    events.forEach(record => {
      const tr = document.createElement("tr");
      // Create a cell for each column.
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
  
  // Save alerts to localStorage.
  function saveAlertsToStorage() {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }
  
  // Load stored events and alerts, then render them.
  loadEventsFromStorage();
  loadAlertsFromStorage();
  renderTable();
  
  // Fetch new data from the Flask endpoint.
  fetch("/modbusModel")
    .then(response => response.json())
    .then(data => {
      // 'rawData' is a JSON string representing an array of row objects.
      const records = JSON.parse(data.rawData);
      
      // Add one row at a time every second.
      let currentRow = 0;
      const interval = setInterval(() => {
        // If all rows are processed, stop the interval.
        if (currentRow >= records.length) {
          clearInterval(interval);
          // Optionally, trigger a new fetch for continuous updates.
          return;
        }
        
        // Get the current record and update its "Time" field.
        let record = records[currentRow];
        record["Time"] = new Date().toLocaleTimeString();
        
        // Attach the prediction value from data.type.
        record.prediction = data.type[currentRow];
        
        // If the prediction is not 2, add it to the alerts.
        if (record.prediction !== 2) {
          // Attach the prediction description using data.predictType.
          record.predictionStr = data.predictType[ record.prediction ];
          alerts.push(record);
          saveAlertsToStorage();
        }
        
        // Add the new record to the events array.
        events.push(record);
        
        // Enforce the maximum number of rows.
        while (events.length > maxRows) {
          events.shift();
        }
        
        // Save the updated events array and re-render the table.
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
