import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";

const Cenario = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const port = searchParams.get("port");
  const ip = searchParams.get("ip");
  const [secondBoxIp, setSecondBoxIp] = useState(""); 
  const [connected, setConnected] = useState(false); 
 

  const handleConnect = () => {
    setConnected(true); // faz aparecer a imagem
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Cenario" subtitle="Welcome to your Cenario" />
      </Box>

      <Box display="flex" alignItems="center" mt="20px">
        <TextField
          label="Second Box IP Address"
          value={secondBoxIp}
          onChange={(e) => setSecondBoxIp(e.target.value)}
          variant="outlined"
          margin="dense"
        />
        <Button variant="contained" onClick={handleConnect} sx={{ ml: "10px" }}>
          Connect
        </Button>
      </Box>

      <Box display="flex" mt="20px">
        <Box flex="1" mr="10px">
          <iframe
            src={`http://${ip}:${port}/`}
            style={{ width: "100%", height: "700px", border: "none" }}
          />
        </Box>

        {connected && (
          <Box flex="1" ml="10px">
            <iframe
              src={`http://${ip}:${secondBoxIp}/`}
              style={{ width: "100%", height: "700px", border: "none" }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Cenario;
