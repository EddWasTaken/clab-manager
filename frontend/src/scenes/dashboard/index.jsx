import { Box, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h1" align="center">
        Clab Manager
      </Typography>
      <Typography variant="subtitle1" align="center">
        Eduardo Margarido || Gerson Fernandes
      </Typography>
      <Typography variant="subtitle2" align="center">
        2022/2023
      </Typography>
    </Box>
  );
};

export default Dashboard;
