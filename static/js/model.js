document.addEventListener('DOMContentLoaded', function() {
  // Select all checkboxes (toggle switches)
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
  // Loop over each checkbox to restore state and add event listener
  checkboxes.forEach((checkbox, index) => {
    // Define a unique key for this checkbox
    const key = 'switch-' + index;
    
    // Retrieve the saved state from localStorage, if any
    const savedState = localStorage.getItem(key);
    if (savedState !== null) {
      checkbox.checked = savedState === 'true';
    }
    
    // When the checkbox changes, update localStorage with the new state
    checkbox.addEventListener('change', function() {
      localStorage.setItem(key, checkbox.checked);
    });
  });
});
