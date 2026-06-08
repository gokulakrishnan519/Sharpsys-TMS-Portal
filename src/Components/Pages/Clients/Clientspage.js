import orange from "../../../Images/orangeicon.png";
import purple from "../../../Images/purpleicon.png";
import green from "../../../Images/greenicon.png";
import Topcard from "../Clients/Topcard";
import { Box, Typography, Avatar, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Clientform from "./Clientform";
import { useState } from "react";
import ClientTable from "./ClientTable";
import Navbar from "../../../Navbars/Navbar";
// import { Box, Typography, Avatar, Button } from "@mui/material";

function Clientpage() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Navbar>
        <div style={{ width: "100%" }}>
          {/* <Typography
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
            Clients
          </Typography> */}
          <Box
            style={{
              display: "flex",
              flexWrap: "wrap",
              padding: 20,
              gap: 8,
              backgroundColor: "white",
              marginTop: 80,
              // width: "50%",
              marginLeft: 14,
            }}
          >
            <Topcard
              num={24}
              title={"Total Users"}
              bgcolor='linear-gradient(135deg, #99dbf0, #99f7d4)'
              color={"#066770"}
              icon={green}
            />
            <Topcard
              num={30}
              title={"Active client"}
              bgcolor={"#f4ebf7"}
              color={"#815f8c"}
              icon={purple}
            />
            <Topcard
              num={21}
              title={"Total Projects "}
              bgcolor={"white"}
              color={"#d9753b"}
              icon={orange}
            />
            <Topcard
              num={18}
              title={"Avg Hour Per Client"}
              bgcolor={"white"}
              color={"#07d1f0"}
              icon={green}
            />
          </Box>

          <Box
            sx={{
              // padding: 3,
              backgroundColor: "white",
              borderRadius: 3,
              marginTop: 3,
              marginX: 2,
              // marginRight: 3,
              // justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "25px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400,
                }}
              >
                Clients
              </h2>
              <Button
                onClick={handleOpen}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  width: "120px",
                  height: "30px",
                  borderRadius: "5px",
                  border: "1px solid #ff6666",
                  // padding: "8px 2px",
                  backgroundColor: "#ff6666",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <AddIcon sx={{ fontSize: "12px" }} />
                New Clients
              </Button>
            </div>
            <ClientTable />
          </Box>
        </div>
        <Clientform open={open} handleClose={handleClose} />
      </Navbar>
    </>
  );
}

export default Clientpage;
