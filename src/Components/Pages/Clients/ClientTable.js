import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../../Loading/Loading";
import UserContext from "../../../UseContext/UserContext";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";

export default function ClientTable() {
  // State
  const [client, setClient] = useState([]);
  const navigate = useNavigate();
  const { Loading, setLoading } = React.useContext(UserContext);
  // Fetch Data
  const fetchClients = async () => {
    setLoading(true);
    await axios
      .get("http://10.10.0.108:8000/clientlist")
      .then((res) => {
        console.log(res.data);

        setClient(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        navigate("/ErrorHandling");
      });
  };

  // Runs Once When Component Loads
  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        overflowX: "auto",
        boxShadow: "none",
      }}
    >
      <Table
        size='small'
        sx={{
          minWidth: { xs: 400, sm: 500, md: "100%" }, // adjust as needed
          "& .MuiTableCell-root": {
            fontFamily: "'Poppins', sans-serif",
            fontSize: {
              xs: "10px",
              sm: "11px",
              md: "12px",
            },
            whiteSpace: "nowrap", // prevents content wrapping
            py: { xs: 0.5, sm: 1 },
          },
        }}
      >
        {/* Header */}
        <TableHead sx={{ backgroundColor: "#f5f7fb" }}>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 600,
                borderRight: "1px solid #e5e7eb",
              }}
            >
              Company Name
            </TableCell>

            <TableCell
              align='center'
              sx={{
                fontWeight: 600,
                borderRight: "1px solid #e5e7eb",
              }}
            >
              Industry
            </TableCell>

            <TableCell
              align='center'
              sx={{
                fontWeight: 600,
                borderRight: "1px solid #e5e7eb",
              }}
            >
              Email
            </TableCell>

            <TableCell
              align='center'
              sx={{
                fontWeight: 600,
                borderRight: "1px solid #e5e7eb",
              }}
            >
              Contact Person
            </TableCell>

            <TableCell
              align='center'
              sx={{
                fontWeight: 600,
                borderRight: "1px solid #e5e7eb",
              }}
            >
              Phone Number
            </TableCell>

            <TableCell
              align='center'
              sx={{
                fontWeight: 600,
                borderRight: "1px solid #e5e7eb",
              }}
            >
              Location
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Body */}
        <TableBody>
          {client.map((item) => (
            <TableRow key={item.ClientID}>
              <TableCell>{item.CompanyName}</TableCell>

              <TableCell align='center'>{item.Industry}</TableCell>

              <TableCell align='center'>{item.Email}</TableCell>

              <TableCell align='center'>{item.ContactPerson}</TableCell>

              <TableCell align='center'>{item.PhoneNumber}</TableCell>

              <TableCell align='center'>{item.Location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
