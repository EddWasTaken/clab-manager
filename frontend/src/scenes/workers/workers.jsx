import React, { useEffect, useState } from "react";
import {
  Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";

const Workers = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerIP, setNewWorkerIP] = useState("");
  const [isCreatingWorker, setIsCreatingWorker] = useState(false);
  const [createWorkerError, setCreateWorkerError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/workers/");
      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }
      const data = await response.json();
      setData(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewWorkerName("");
    setNewWorkerIP("");
    setCreateWorkerError(null);
  };

  const handleCreateWorker = async () => {
    if (newWorkerName === "") {
      setCreateWorkerError("The Worker must have a name");
      return;
    }

    try {
      setIsCreatingWorker(true);

      const response = await fetch("/api/workers/");
      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const existingWorkers = await response.json();

      const workerExists = existingWorkers.some((worker) => worker.name === newWorkerName);
      if (workerExists) {
        setCreateWorkerError("Worker already exists");
        setIsCreatingWorker(false);
        return;
      }

      const createResponse = await fetch("/api/workers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newWorkerName, ip: newWorkerIP }),
      });

      setIsCreatingWorker(false);

      if (!createResponse.ok) {
        throw new Error("Failed to create worker");
      }

      setNewWorkerName("");
      setNewWorkerIP("");
      handleDialogClose();
      fetchData();
    } catch (error) {
      setCreateWorkerError("Failed to create worker");
      console.error(error);
    }
  };

  const handleDeleteWorker = async (workerName) => {
    const response = await fetch(`/api/deployments/`);
    if (!response.ok) {
      throw new Error("Failed to fetch deployments");
    }

    const deployments = await response.json();

    const associatedDeployments = deployments.filter((deployment) => deployment.worker_name === workerName);

    if (associatedDeployments.length > 0) {
      window.alert(`The worker "${workerName}" has deployments associated and cannot be deleted.`);
    } else {
      const confirmDelete = window.confirm(`Are you sure you want to delete the worker "${workerName}"?`);

      if (confirmDelete) {
        try {
          const deleteResponse = await fetch(`/api/workers/${workerName}`, {
            method: "DELETE",
          });

          if (!deleteResponse.ok) {
            throw new Error("Failed to delete worker");
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
        <Header title="Workers" />
        <Button variant="contained" onClick={handleDialogOpen}>
          Create Worker
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
                <TableCell>Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>IP</TableCell>
                <TableCell>***</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((worker) => (
                <TableRow key={worker._id}>
                  <TableCell>{worker.name}</TableCell>
                  <TableCell>{worker._id}</TableCell>
                  <TableCell>{worker.ip}</TableCell>
                  <TableCell>
      
                    <IconButton
                color="error"
                onClick={() => handleDeleteWorker(worker.name)}
              >
                <DeleteIcon />
              </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Create Worker</DialogTitle>
        <DialogContent>
          {createWorkerError && <div>Error: {createWorkerError}</div>}
          <TextField
            label="Name"
            fullWidth
            value={newWorkerName}
            onChange={(e) => {
              setNewWorkerName(e.target.value);
              setCreateWorkerError(null);
            }}
          />
          <TextField
            label="IP"
            fullWidth
            value={newWorkerIP}
            onChange={(e) => setNewWorkerIP(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateWorker} disabled={isCreatingWorker}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Workers;
