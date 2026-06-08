import { Box, Typography, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import orange from "../../../Images/orangeicon.png";
import purple from "../../../Images/purpleicon.png";
import green from "../../../Images/greenicon.png";

function Topcard(props) {
  const { num } = props;
  const { title } = props;
  const { bgcolor } = props;
  const { color } = props;
  const { icon } = props;
  return (
    <Box
      sx={{
        width: 100,
        height: 100,
        background: bgcolor,
        borderRadius: 3,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // boxShadow: 2,
        border: "0.5px solid lightgray",
        paddingX: 2,
        fontSize: "8px",
      }}
    >
      {/* Top Circle Icon */}

      <img
        src={icon}
        alt='logo'
        // width="20"
        style={{
          width: 30,
          height: 30,
          position: "absolute",
          top: -20,
          backgroundColor: "white",
          borderRadius: "20px",
          borderBottom: "0.5px solid lightgray",
          padding: 3,
        }}
      />

      {/* Number */}
      <Typography
        variant='h5'
        sx={{
          color: color,
          mt: 2,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {num}
      </Typography>

      {/* Text */}
      <Typography
        variant='body2'
        sx={{
          color: "#333",
          fontWeight: 100,
          fontSize: "12px",
          // flex:"justifyContent",
          textAlign: "center",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export default Topcard;
