import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";

const Cenario = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const port = searchParams.get("port");
  console.log(port);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Cenario" subtitle="Welcome to your Cenario" />
      </Box>

      <Box mt="20px">
        <iframe
        //atenção ao IP -> Depois Mudar ################3
          src={`http://192.168.83.211:${port}/`}
          style={{ width: "70%", height: "700px", border: "none" }}
        />
      </Box>
    </Box>
  );
};

export default Cenario;
