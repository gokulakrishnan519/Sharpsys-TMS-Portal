// import Gridcard from "../Gridcard";
import Gridcard from "./Gridcard";
import AddIcon from "@mui/icons-material/Add";
import Projectform from "./Projectform";
import orange from "../../../Images/orangeicon.png";
import purple from "../../../Images/purpleicon.png";
import green from "../../../Images/greenicon.png";
import Topcard from "./Topcard";
import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../Navbars/Navbar";

function ProjectsPage() {
  // const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [prjdetails, setPrjdetails] = useState([]);
  const [mode, setMode] = useState("add");
  const [selectedProject, setSelectedProject] = useState(null);
  const handleEdit = (project) => {
    console.log("Editing Project:", project);

    setSelectedProject(project);
    setMode("edit");
    setOpen(true);
  };
  // const handleAdd = () => {
  //   setSelectedProject(null);
  //   setMode("add");
  //   setOpen(true);
  // };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchProjectdetails = async () => {
    await axios
      .get("http://10.10.0.47:7000/project/projectdetails")
      .then((res) => {
        console.log(res.data.projects);
        setPrjdetails(res.data.projects);
      });
  };

  useEffect(() => {
    fetchProjectdetails();
  }, []);

  return (
    <>
      <Navbar>
        {/* Main content */}
        <div style={{ width: "100%" }}>
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
            Projects
          </Typography>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              padding: 20,
              gap: 8,
              backgroundColor: "white",
              marginTop: 35,
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
          </div>
          <Box
            sx={{
              paddingX: 3,
              backgroundColor: "white",
              borderRadius: 3,
              marginTop: 3,
              marginX: 2,
              // width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                // padding: "10px",
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
                Ongoing Projects
              </h2>
              <Button
                onClick={handleOpen}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  // width: "120px",
                  height: "30px",
                  borderRadius: "5px",
                  border: "1px solid #ff6666",
                  // padding: "8px 2px",
                  backgroundColor: "#ff6666",
                  color: "white",
                  cursor: "pointer",
                  fontSize: { xs: "8px", sm: "8px", md: "10px", lg: "10px" },
                  fontFamily: "'Poppins', sans-serif",
                  minWidth: { sm: "50px", md: "80px", lg: "120px" },
                }}
              >
                <AddIcon sx={{ fontSize: "12px" }} />
                New Project
              </Button>
            </div>

            <Box
              sx={{
                display: "grid",
                // gridTemplateColumns: "1fr 1fr",
                columnGap: "10px",
                rowGap: "15px",
                gridTemplateColumns: {
                  xs: "1fr",
                  // sm: "1fr 1fr",
                  md: "1fr 1fr ",
                  lg: "1fr 1fr",
                },
              }}
            >
              {prjdetails.map((prj) => (
                <Gridcard
                  key={prj.ProjectID}
                  project={prj}
                  title={prj.ProjectName}
                  priority={prj.Priority}
                  s_date={prj.StartDate}
                  e_date={prj.EndDate}
                  client={prj.ClientName}
                  project_manager={prj.ProjectLead}
                  sla={prj.SLAConfiguration}
                  assigned={prj.AssignedTo}
                  onEdit={handleEdit}
                />
              ))}
            </Box>

            {/* <Gridcard title={"Vendor Portal"} p_value={"85"} />
            <Gridcard title={"Vendor admin Portal"} p_value={"23"} />
            <Gridcard title={"Sharp Desk"} p_value={"65"} /> */}
          </Box>
        </div>
        <Projectform
          open={open}
          handleClose={handleClose}
          selectedProject={selectedProject}
          mode={mode}
          refreshProjects={fetchProjectdetails}
        />
      </Navbar>
    </>
  );
}

export default ProjectsPage;
