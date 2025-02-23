document.addEventListener('DOMContentLoaded', function() {
  // Define the nodes for the network
  const nodes = new vis.DataSet([
    { id: 1, label: "Node 1" },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" }
  ]);

  // Define the edges between nodes
  const edges = new vis.DataSet([
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 5 }
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
