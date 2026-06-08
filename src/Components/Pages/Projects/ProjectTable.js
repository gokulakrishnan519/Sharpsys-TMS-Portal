import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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

          <TableCell>{assigned}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
