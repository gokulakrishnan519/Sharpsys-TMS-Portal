import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

export default function Loading() {
  return (
    <div>
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative", // IMPORTANT
          overflow: "hidden",
        }}
      >
        <CircularProgress enableTrackSlot size='3rem' />
        {/* GIF */}
        {/* <img
          src={loadingVideo}
          alt='Loading...'
          style={{ width: "100%", height: 400, objectFit: "contain" }}
        /> */}

        {/* TEXT OVERLAY */}
        <Typography
          sx={{
            position: "absolute", // 👈 Text will go on top!
            bottom: 180, // Image-oda bottom-la text varum (adjust pannalaam)
            fontFamily: "Poppins, sans-serif",
            fontSize: "1rem",
            color: "#2e2e2e",
          }}
        >
          Loading, please wait...
        </Typography>
      </Box>
    </div>
  );
}
