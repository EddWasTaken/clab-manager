import yaml from "js-yaml";
import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import Header from "../../components/Header";

const Generator = () => {
  const [name, setName] = useState("");
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [topology, setYaml] = useState("");

  const handleAddNode = () => {
    setNodes([...nodes, { kind: "", image: "", ports: [] }]);
  };

  const handleNodeChange = (index, field, value) => {
    const updatedNodes = [...nodes];
    updatedNodes[index][field] = value;
    setNodes(updatedNodes);
  };

  const handleAddLink = () => {
    setLinks([...links, { endpoints: [] }]);
  };

  const handleLinkChange = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index].endpoints = value.split(",");
    setLinks(updatedLinks);
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
    links.forEach((link, index) => {
      yamlString += `    - endpoints: [${link.endpoints.map((ep) => `"${ep}"`).join(", ")}]\n`;
    });
    setYaml(yamlString);
  };

  const postDeploy = async () => {

    const jsonObj = yaml.load(topology);
    const jsonStr = JSON.stringify(jsonObj);

    try {
      const response = await fetch("/api/topologies/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonStr,
      
      });
      if (response.ok) {
        
        console.log("Deploy successful");
      } else {
       
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
          <Header title="YAML Generator"/>
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
            <Box key={index} mt="20px">
              <TextField
                label="Node Kind"
                value={node.kind}
                onChange={(e) => handleNodeChange(index, "kind", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Node Image"
                value={node.image}
                onChange={(e) => handleNodeChange(index, "image", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Node Ports"
                value={node.ports.join(",")}
                onChange={(e) => handleNodeChange(index, "ports", e.target.value.split(","))}
                fullWidth
                margin="normal"
              />
            </Box>
          ))}
          <Button variant="contained" onClick={handleAddLink} mt="20px">
            Add Link
          </Button>
          {links.map((link, index) => (
            <Box key={index} mt="20px">
              <TextField
                label="Link Endpoints"
                value={link.endpoints.join(",")}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                fullWidth
                margin="normal"
              />
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
