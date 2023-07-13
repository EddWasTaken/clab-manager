import yaml from "js-yaml";
import React, { useState } from "react";
import { Box, TextField, Button, Select, MenuItem, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
const Generator = () => {
  const [name, setName] = useState("");
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [topology, setYaml] = useState("");

  const handleAddNode = () => {
    setNodes([
      ...nodes,
      {
        selectedOption: "Select Server",
        kind: "",
        image: "",
        interfacePool: [],
        ports: [],
      },
    ]);
    generateYaml();
  };

  const handleNodeChange = (index, field, value) => {
    const updatedNodes = [...nodes];
    updatedNodes[index][field] = value;
    setNodes(updatedNodes);
    generateYaml();
  };

  const handleKindImageChange = (index, value) => {
    const updatedNodes = [...nodes];
    updatedNodes[index].selectedOption = value;

    switch (value) {
      case "SR Linux":
        updatedNodes[index].kind = "srl";
        updatedNodes[index].image = "ghcr.io/nokia/srlinux";
        
        break;
      case "Router Ceos":
        updatedNodes[index].kind = "ceos";
        updatedNodes[index].image = "ceos:4.30.0F";
        
        break;
      case "Server Nginx":
        updatedNodes[index].kind = "linux";
        updatedNodes[index].image = "nginx:latest";
       
        break;
      case "Linux Desktop":
        updatedNodes[index].kind = "linux";
        updatedNodes[index].image = "dorowu/ubuntu-desktop-lxde-vnc";
        
        break;
      case "Other":
        updatedNodes[index].kind = "";
        updatedNodes[index].image = "";
    
        break;
      default:
        break;
    }

    setNodes(updatedNodes);
    generateYaml();
  };

  const handleKindImageInputChange = (index, field, value) => {
    const updatedNodes = [...nodes];
    updatedNodes[index][field] = value;
    setNodes(updatedNodes);
    generateYaml();
  };

  const handleAddLink = () => {
    setLinks([...links, { node1: "", interface1: "", node2: "", interface2: "" }]);
    generateYaml();
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
    generateYaml();
  };

  const handleDeleteNode = (index) => {
    const updatedNodes = [...nodes];
    updatedNodes.splice(index, 1);
    setNodes(updatedNodes);
    generateYaml();
  };

  const handleDeleteLink = (index) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
    generateYaml();
  };

  const generateYaml = () => {
    let yamlString = `name: ${name}\ntopology:\n  nodes:\n`;
    nodes.forEach((node, index) => {
      yamlString += `    node${index + 1}:\n`;
      yamlString += `      kind: ${node.kind}\n`;
      yamlString += `      image: ${node.image}\n`;
      if (node.ports.length > 0) {
        yamlString += `      ports:\n`;
        node.ports.forEach((port) => {
          yamlString += `        - ${port}\n`;
        });
      }
    });
    yamlString += "  links:\n";
    links.forEach((link) => {
      yamlString += `    - endpoints: ["${link.node1}:${link.interface1}", "${link.node2}:${link.interface2}"]\n`;
    });
    setYaml(yamlString);
  };

  const postDeploy = async () => {
    const jsonObj = yaml.load(topology);
    const jsonStr = JSON.stringify(jsonObj);
  
    try {
      // Retrieve existing topologies
      const response = await fetch("/api/topologies");
      const topologies = await response.json();
  
      // Check if topology name already exists
      const existingTopology = topologies.find((topology) => topology.name === name);
      if (existingTopology) {
        window.alert("Topology name already exists");
        console.error("Topology name already exists");
        return;
      }
  
      // Deploy the topology
      const deployResponse = await fetch("/api/topologies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonStr,
      });
  
      if (deployResponse.ok) {
        window.alert("Deploy successful");
        console.log("Deploy successful");
  
        // Reset the form values
        setName("");
        setNodes([]);
        setLinks([]);
        setYaml("");
      } else {
        window.alert("Deploy failed");
        console.error("Deploy failed");
      }
    } catch (error) {
      console.error("Error occurred during deployment:", error);
    }
  };

  return (
    <Box m="20px" display="flex">
      <Box flex="1">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <h1>YAML Generator</h1>
        </Box>
        <Box mt="20px">
          <TextField
            label="Topology Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleAddNode}>
            Add Node
          </Button>
          {nodes.map((node, index) => (
            <Box key={index} mt="20px" display="flex" alignItems="center">
              <Box flex="1" mr="10px">
                <Select
                  onChange={(e) => handleKindImageChange(index, e.target.value)}
                  fullWidth
                  margin="normal"
                  value={node.selectedOption}
                >
                  <MenuItem value="Select Server">Select Server</MenuItem>
                  <MenuItem value="SR Linux">SR Linux</MenuItem>
                  <MenuItem value="Router Ceos">Router Ceos</MenuItem>
                  <MenuItem value="Server Nginx">Server Nginx</MenuItem>
                  <MenuItem value="Linux Desktop">Linux Desktop</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </Box>
              {node.selectedOption === "Other" ? (
                <>
                  <Box flex="1" mr="10px">
                    <TextField
                      label="Node Kind"
                      value={node.kind}
                      onChange={(e) =>
                        handleKindImageInputChange(index, "kind", e.target.value)
                      }
                      fullWidth
                      margin="normal"
                    />
                  </Box>
                  <Box flex="1" mr="10px">
                    <TextField
                      label="Node Image"
                      value={node.image}
                      onChange={(e) =>
                        handleKindImageInputChange(index, "image", e.target.value)
                      }
                      fullWidth
                      margin="normal"
                    />
                  </Box>
                </>
              ) : null}
              <Box flex="1" mx="10px">
                <TextField
                  label="Node Ports"
                  value={node.ports.join(",")}
                  onChange={(e) =>
                    handleNodeChange(index, "ports", e.target.value.split(","))
                  }
                  fullWidth
                  margin="normal"
                />
              </Box>
              <IconButton
                color="error"
                onClick={() => handleDeleteNode(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button variant="contained" onClick={handleAddLink} mt="20px">
            Add Link
          </Button>

          {links.map((link, index) => (
            <Box key={index} mt="20px" display="flex" alignItems="center">
              <Box flex="1" mr="10px">
                <Select
                  onChange={(e) =>
                    handleLinkChange(index, "node1", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  value={link.node1}
                >
                  <MenuItem value="">Select Node</MenuItem>
                  {nodes.map((node, nodeIndex) => (
                    <MenuItem
                      value={`node${nodeIndex + 1}`}
                      key={`node1-${nodeIndex}`}
                    >
                      {`Node ${nodeIndex + 1}`}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box flex="1" mx="10px">
                <Select
                  onChange={(e) =>
                    handleLinkChange(index, "interface1", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  value={link.interface1}
                >
                  <MenuItem value="">Select Interface</MenuItem>
                  {link.node1 &&
                    nodes.map((node, nodeIndex) => {
                      if (link.node1 === `node${nodeIndex + 1}`) {
                        const interfaceOptions =
                          node.selectedOption === "SR Linux"
                            ? ["e1-1", "e1-2"]
                            : node.selectedOption === "Router Ceos"
                            ? ["eth1", "eth2", "eth3", "eth4", "eth5", "eth6"]
                            : ["eth1", "eth2"];

                        return interfaceOptions.map((option) => (
                          <MenuItem value={option} key={option}>
                            {option}
                          </MenuItem>
                        ));
                      }
                      return null;
                    })}
                </Select>
              </Box>
              <Box flex="1" ml="10px">
                <Select
                  onChange={(e) =>
                    handleLinkChange(index, "node2", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  value={link.node2}
                >
                  <MenuItem value="">Select Node</MenuItem>
                  {nodes.map((node, nodeIndex) => (
                    <MenuItem
                      value={`node${nodeIndex + 1}`}
                      key={`node2-${nodeIndex}`}
                    >
                      {`Node ${nodeIndex + 1}`}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box flex="1" mx="10px">
                <Select
                  onChange={(e) =>
                    handleLinkChange(index, "interface2", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  value={link.interface2}
                >
                  <MenuItem value="">Select Interface</MenuItem>
                  {link.node2 &&
                    nodes.map((node, nodeIndex) => {
                      if (link.node2 === `node${nodeIndex + 1}`) {
                        const interfaceOptions =
                          node.selectedOption === "SR Linux"
                            ? ["e1-1", "e1-2"]
                            : node.selectedOption === "Router Ceos"
                            ? ["eth1", "eth2", "eth3", "eth4", "eth5", "eth6"]
                            : ["eth1", "eth2"];

                        return interfaceOptions.map((option) => (
                          <MenuItem value={option} key={option}>
                            {option}
                          </MenuItem>
                        ));
                      }
                      return null;
                    })}
                </Select>
              </Box>
              <IconButton
                color="error"
                onClick={() => handleDeleteLink(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
      <Box flex="1" ml="20px">
        <Button variant="contained" onClick={generateYaml} mt="20px">
          Generate YAML
        </Button>
        <Button variant="contained" onClick={postDeploy} mt="20px">
          Save
        </Button>
        {topology && (
          <Box mt="20px" p="10px" border="1px solid #ccc" fontFamily="monospace">
            <pre>{topology}</pre>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Generator;