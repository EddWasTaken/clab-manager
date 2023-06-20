import React, { useEffect, useState } from "react";
import { Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

import Header from "../../components/Header";

const Topologies = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/topologies/");
      if (!response.ok) {
        throw new Error("Failed to fetch topologies");
      }
      const data = await response.json();
      setData(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteTopology = async (topologyName) => {
    const response = await fetch(`/api/deployments/`);
    if (!response.ok) {
      throw new Error("Failed to fetch deployments");
    }

    const deployments = await response.json();

    // Vê se a topologia esta registada nos deployments
    const associatedDeployments = deployments.filter((deployment) => deployment.topo_name === topologyName);

    if (associatedDeployments.length > 0) {
      
      window.alert(`The topology "${topologyName}" has deployments associated and cannot be deleted.`);
    } else {
      const confirmDelete = window.confirm(`Are you sure you want to delete the topology "${topologyName}"?`);

      if (confirmDelete) {
        try {
          const deleteResponse = await fetch(`/api/topologies/${topologyName}`, {
            method: "DELETE",
          });

          if (!deleteResponse.ok) {
            throw new Error("Failed to delete topology");
          }

  
          fetchData();
        } catch (error) {
          console.error(error);
          
          window.alert(`Error: ${error.message}`);
        }
      }
    }
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Topologies" />
      </Box>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((topology) => (
                <TableRow key={topology._id}>
                  <TableCell>{topology.name}</TableCell>
                  <TableCell>{topology._id}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleDeleteTopology(topology.name)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Topologies;
