import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Typography } from "@mui/material";

const priorityP = (x) => {
  let style = {};

  if (x === "At Risk") {
    style = {
      color: "#d32f2f",
      // backgroundColor: "#ffebee",
    };
  } else if (x === "Delayed") {
    style = {
      color: "#ed6c02",
      // backgroundColor: "#fff3e0",
    };
  } else if (x === "On Track") {
    style = {
      color: "#2e7d32",
      // backgroundColor: "#e8f5e9",
    };
  }

  return {
    ...style,
    fontFamily: "'Poppins', sans-serif",
    fontSize: "12px",
    fontWeight: 500,
  };
};

const BorderLinearProgress = styled(LinearProgress)(
  ({ theme, gradient, height }) => ({
    height: height,
    borderRadius: 5,

    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[200],
    },

    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 3,
      background: gradient,
    },
  }),
);

export default function Progress(props) {
  const { p_value, gradient, height, default_text } = props;
  const { priority } = props;
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{ width: "100%", mt: 2 }}
    >
      <BorderLinearProgress
        variant="determinate"
        value={p_value}
        gradient={gradient}
        height={height}
        sx={{ flex: 1 }}
      />
      <Stack>
        <Typography
          variant="caption"
          sx={{
            ...priorityP(priority),
            // fontSize: "14px",
            // fontWeight: 600,
            lineHeight: 1,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {priority}
        </Typography>

        <Typography
          sx={{
            color: "gray",
            fontSize: "10px",
            lineHeight: 1,
            fontFamily: "'Poppins', sans-serif",
            mt: 0.5,
          }}
        >
          {default_text}
        </Typography>
      </Stack>
    </Stack>
  );
}
