document.addEventListener('DOMContentLoaded', function() {
  // Define the nodes for the network
  const nodes = new vis.DataSet([
    { id: 1, label: "Thermostat" },
    { id: 2, label: "Heater" },
    { id: 3, label: "Air Conditioning" },
    { id: 4, label: "Fridge" },
    { id: 5, label: "Router" },
	{ id: 6, label: "Web" }
  ]);

  // Define the edges between nodes
  const edges = new vis.DataSet([
    { from: 2, to: 1 },
    { from: 3, to: 1 },
    { from: 1, to: 5 },
    { from: 4, to: 5 },
    { from: 5, to: 6, title:"Modbus" }
  ]);

  // Get the network container element
  const container = document.getElementById("network");

  // Prepare the data in the vis format
  const data = {
    nodes: nodes,
    edges: edges
  };

  // Set options for the network (physics enabled for layout)
  const options = {
    physics: {
      enabled: true
    }
  };

  // Initialize the network
  new vis.Network(container, data, options);
});
