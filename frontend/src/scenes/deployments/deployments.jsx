import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import {
  Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, Dialog,
  DialogTitle,DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";

const Deployments = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [topologies, setTopologies] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedTopology, setSelectedTopology] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/deployments/");
        if (!response.ok) {
          throw new Error("Failed to fetch deployments");
        }
        const data = await response.json();
        // Mudar mais tarde -> Adicionar o porto á base de dados
        const updatedData = data.map((deployment) => ({
          ...deployment,
          port: "50080",
        }));
        setData(updatedData);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch("/api/workers/");
        if (!response.ok) {
          throw new Error("Failed to fetch workers");
        }
        const data = await response.json();
        setWorkers(data);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    const fetchTopologies = async () => {
      try {
        const response = await fetch("/api/topologies/");
        if (!response.ok) {
          throw new Error("Failed to fetch topologies");
        }
        const data = await response.json();
        setTopologies(data);
      } catch (error) {
        console.error("Error fetching topologies:", error);
      }
    };

    fetchWorkers();
    fetchTopologies();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedWorker("");
    setSelectedTopology("");
    setOpenDialog(false);
  };

  const handleWorkerChange = (event) => {
    setSelectedWorker(event.target.value);
  };

  const handleTopologyChange = (event) => {
    setSelectedTopology(event.target.value);
  };

  const handleDeploymentCreate = async () => {
    try {
      const response = await fetch("/api/deployments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worker_name: selectedWorker.name,
          topo_name: selectedTopology.name,
          worker_id: selectedWorker._id,
          topo_id: selectedTopology._id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create deployment");
      }
      const newDeployment = await response.json();
     ////remover no fim de adicionar á base de dados
      newDeployment.port = "50080";
      setData([...data, newDeployment]);
      setSelectedWorker("");
      setSelectedTopology("");
      handleCloseDialog();
    } catch (error) {
      console.error("Error creating deployment:", error);
    }
  };

  const handleOpenWindow = (port) => {
    const url = `/cenario?port=${port}`;
    window.open(url, "_self");
  };
  

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Deployments" />
        <Button variant="contained" onClick={handleOpenDialog} mt="20px">
          Create Deployment
        </Button>
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
                <TableCell>Worker NAME</TableCell>
                <TableCell>Topology NAME</TableCell>
                <TableCell>Port</TableCell>
                <TableCell>Teste</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((deployment) => (
                <TableRow key={deployment._id}>
                  <TableCell>{deployment.worker_name}</TableCell>
                  <TableCell>{deployment.topo_name}</TableCell>
                  <TableCell>{deployment.port}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleOpenWindow(deployment.port)}
                      mt="20px"
                    >
                      Rebenta
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create Deployment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select Worker</InputLabel>
            <Select
              value={selectedWorker}
              onChange={handleWorkerChange}
              label="Select Worker"
            >
              {workers.map((worker) => (
                <MenuItem key={worker.id} value={worker}>
                  {worker.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Select Topology</InputLabel>
            <Select
              value={selectedTopology}
              onChange={handleTopologyChange}
              label="Select Topology"
            >
              {topologies.map((topology) => (
                <MenuItem key={topology.id} value={topology}>
                  {topology.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseDialog} mt="20px">
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleDeploymentCreate}
            mt="20px"
            disabled={!selectedWorker || !selectedTopology}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Deployments;
