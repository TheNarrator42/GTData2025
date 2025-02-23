document.addEventListener('DOMContentLoaded', function() {
  // The key under which alerts are stored in localStorage.
  const ALERTS_KEY = 'alertData';
  
  // Get a reference to the table body.
  const tbody = document.getElementById('report-table-body');
  
  // Load alert data from localStorage.
  let alerts = [];
  const storedAlerts = localStorage.getItem(ALERTS_KEY);
  if (storedAlerts) {
    try {
      alerts = JSON.parse(storedAlerts);
    } catch (e) {
      console.error('Error parsing alert data from localStorage:', e);
      alerts = [];
    }
  }
  
  // If no alerts are found, display a "No alerts" message.
  if (alerts.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 3;
    td.className = 'no-alerts';
    td.textContent = 'No alerts found.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }
  
  // For each alert, create a row with:
  // - Timestamp (from the record's "Time" property),
  // - IoT Type (fixed as "ModelBus"),
  // - Prediction Type (from record.predictionStr).
  alerts.forEach(alert => {
    const tr = document.createElement('tr');
    
    // Timestamp cell.
    const tdTime = document.createElement('td');
    tdTime.textContent = alert["Time"] || 'N/A';
    tr.appendChild(tdTime);
    
    // IoT Type cell (hard-coded to "ModelBus").
    const tdIOT = document.createElement('td');
    tdIOT.textContent = 'ModelBus';
    tr.appendChild(tdIOT);
    
    // Prediction Type cell.
    const tdPrediction = document.createElement('td');
    tdPrediction.textContent = alert.predictionStr || 'Unknown';
    tr.appendChild(tdPrediction);
    
    tbody.appendChild(tr);
  });
});
