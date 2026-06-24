import { Box, Typography, Avatar } from "@mui/material";

import Tabledata from "./ProjectTable";
import dayjs from "dayjs";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

function Gridcard(props) {
  //   const { num } = props;
  const { title, priority, s_date, e_date } = props;
  const { p_value, client, project_manager, sla, assigned, onEdit, project } =
    props;
  console.log("Received props:", props);
  console.log("Received project:", project);
  const startDate = dayjs("2026-03-10");
  const endDate = dayjs("2026-03-26");
  const priorityd = (x) =>
    ({
      High: {
        color: "#d32f2f",
        backgroundColor: "#ffebee",
      },
      Medium: {
        color: "#ed6c02",
        backgroundColor: "#fff3e0",
      },
      Low: {
        color: "#2e7d32",
        backgroundColor: "#e8f5e9",
      },
    })[x] || {};

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        border: "0.5px solid rgba(0,0,0,0.08)",
        // boxShadow:1,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        // justifyContent: "flex-start",
        // justifyContent:"center",
        padding: 2,
        // padding:"5px",
        // paddingX:2,
        marginTop: 1,
        position: "relative",
        backgroundColor: "white",
        fontFamily: "'Poppins', sans-serif",
        fontSize: "14px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          // mt: 1,
        }}
      >
        <Typography
          variant='h5'
          sx={{
            color: "#000000",
            fontSize: "20px",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {title}
        </Typography>
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Typography
            sx={{
              borderRadius: 5,
              width: "60px",
              textAlign: "center",
              padding: "2px 6px",
              fontSize: "10px",
              fontFamily: "Poppins, sans-serif",
              ...priorityd(priority),
            }}
          >
            {priority}
          </Typography>
          <EditOutlinedIcon
            onClick={() => {
              console.log("Gridcard Project:", project);
              onEdit(project);
            }}
            sx={{
              fontSize: "20px",
              borderRadius: "20px",
              padding: 0.5,
              background: "#14dde1",
              color: "#011e1e",
              cursor: "pointer",
            }}
          />
        </div>
      </Box>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          // gap: 2,
        }}
      >
        <div style={{ paddingTop: 4, width: "70%" }}>
          <Tabledata
            client={client}
            project_manager={project_manager}
            sla={sla}
            assigned={assigned}
          />
        </div>
        <p
          style={{
            width: "30%",
            color: "gray",
            fontSize: "10px",
            fontFamily: "'Poppins', sans-serif",
            margin: 0,
          }}
        >
          {s_date ? dayjs(s_date).format("DD/MM/YYYY") : "-"}-
          {e_date ? dayjs(e_date).format("DD/MM/YYYY") : "-"}
        </p>
      </div>
      {/* <div style={{ padding: 5, backgroundColor: "#e6f9ff", borderRadius: 8,margin:3 }}>
        <Progress p_value={p_value}/>
      </div> */}
      {/* <Typography
        variant="caption"
        sx={{
          position: "absolute",
          bottom: 8,
          right: 10,
          display: "flex",
          gap: 1,
          fontSize:"10px"
        }}
      >
        <a href="#" >
          Edit
        </a>
        <a href="#">View Task</a>
      </Typography> */}
    </Box>
  );
}

export default Gridcard;
