import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Chip } from "@mui/material";

export default function Tabledata(props) {
  const { p_value, client, project_manager, sla, assigned } = props;
  return (
    <Table
      sx={{
        "& td, & th": {
          border: 0,
          padding: "4px 8px",
          fontSize: "12px",
          fontFamily: "'Poppins', sans-serif",
        },
      }}
    >
      <TableBody>
        <TableRow>
          <TableCell sx={{ fontWeight: 550 }}>Client</TableCell>

          <TableCell>{client}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell sx={{ fontWeight: 550 }}>Project Manager</TableCell>

          <TableCell>{project_manager}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell sx={{ fontWeight: 550 }}>SLA</TableCell>

          <TableCell>{sla}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell sx={{ fontWeight: 550 }}>Assigned Members</TableCell>

          <TableCell>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {assigned.slice(0, 3).map((person, idx) => (
                <Chip
                  key={idx}
                  label={person}
                  size="small"
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: 12,
                    fontWeight: 500,
                    bgcolor: "#EEF2FF",
                    color: "#4F46E5",
                    height: 24,
                  }}
                />
              ))}
              {assigned.length > 3 && (
                <Chip
                  label={`+${assigned.length - 3}`}
                  size="small"
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: 12,
                    fontWeight: 600,
                    bgcolor: "#F1F5F9",
                    color: "#64748B",
                    height: 24,
                  }}
                />
              )}
            </Box>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
