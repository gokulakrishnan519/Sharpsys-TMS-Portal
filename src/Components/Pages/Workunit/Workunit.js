import { Box, Typography } from "@mui/material";
import WorkunitTable from "./WorkunitTable";
import Navbar from "../../../Navbars/Navbar";

function Workunit() {
  return (
    <>
      <Navbar>
        <Typography
          variant='h6'
          sx={{
            fontFamily: "'Poppins', sans-serif",
            mt: 2,
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#f5f7fb",
            p: 0.5,
          }}
        >
          Work Unit
        </Typography>
        <Box
          sx={{
            // width: "100%",
            // height: "600px",
            background: "white",
            borderRadius: "12px",
            mt: 3,
            justifyContent: "center",
            ml: 3,
            // display: "flex",
            // flexDirection: "column",
            // overflow: "hidden",
          }}
        >
          <Typography sx={{ padding: 2 }}>Action Items</Typography>
          <WorkunitTable />
        </Box>
      </Navbar>
    </>
  );
}

export default Workunit;
