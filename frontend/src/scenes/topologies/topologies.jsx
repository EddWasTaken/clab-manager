import React, { useEffect, useState } from "react";
import { Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

import Header from "../../components/Header";

const Topologies = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  

    useEffect(() => {
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
          console.log(data)
        };

        fetchData();
    }, []);
    
    return (
        <Box m="20px">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="Topologies"/>
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