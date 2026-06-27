import React, { useState, useMemo } from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Autocomplete,
  Box,
  Button,
  Divider,
  Chip,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Fade,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Navbar from "../../../Navbars/Navbar";
import dayjs from "dayjs";

// npm i @mui/x-date-pickers date-fns  (if not already installed)

// Placeholder option lists — replace with API data
const employeeOptions = ["John Doe", "Jane Smith", "Arun Kumar", "Priya Raj"];
const companyOptions = ["Acme Corp", "Globex Inc", "Initech", "Umbrella Co"];
const projectOptions = [
  "Website Revamp",
  "Mobile App",
  "ERP Migration",
  "Cloud Setup",
];

// ---------------------------------------------------------------------------
// Design tokens
// A small, deliberate palette: ink-navy for structure, a single warm amber
// accent for emphasis (hours, totals, the brand mark), and a muted slate
// for secondary text. Two type roles: a slightly condensed display weight
// for headings/numbers, and a humanist sans for body copy.
// ---------------------------------------------------------------------------
const tokens = {
  ink: "#15192B", // primary text / headings
  slate: "#5B6273", // secondary text
  hairline: "#E4E6ED", // borders / dividers
  surface: "#FFFFFF",
  canvas: "#F7F7FA", // page wash behind cards
  accent: "#C8742B", // warm amber — used sparingly, for emphasis only
  accentSoft: "#FBEDE0",
  good: "#1F7A5C",
  goodSoft: "#E7F4EE",
  warn: "#B25E12",
  warnSoft: "#FCEEDF",
  brand: "#e3264b", // primary action color — buttons
  brandHover: "#c91f41",
};

const FONT_DISPLAY = "'Lexend', 'Poppins', sans-serif";
const FONT_BODY = "'Inter', 'Poppins', sans-serif";

// Helpers to default the date range to the current month
// (DatePicker works with Date objects, not ISO strings)
const getMonthStart = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};
const getToday = () => new Date();

const FIELD_SX = {
  fontFamily: FONT_BODY,
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    backgroundColor: tokens.surface,
    "& fieldset": { borderColor: tokens.hairline },
    "&:hover fieldset": { borderColor: tokens.ink },
    "&.Mui-focused fieldset": { borderColor: tokens.accent, borderWidth: 1.5 },
  },
  "& .MuiInputLabel-root": { fontFamily: FONT_BODY, fontSize: 13.5 },
};

const ReportTable = () => {
  const [employee, setEmployee] = useState(null);
  const [company, setCompany] = useState(null);
  const [project, setProject] = useState(null);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState([
    // sample data — replace with API response
    {
      date: "2026-06-20",
      task: "UI Development",
      hours: 6,
      comments: "Completed dashboard",
    },
    {
      date: "2026-06-21",
      task: "API Integration",
      hours: 8.5,
      comments: "In progress",
    },
    {
      date: "2026-06-22",
      task: "Code Review",
      hours: 4,
      comments: "Reviewed PR #182",
    },
  ]);

  const totalHours = useMemo(
    () => rows.reduce((sum, r) => sum + Number(r.hours || 0), 0),
    [rows],
  );

  const activeFilterCount = [employee, company, project].filter(Boolean).length;

  const handleSearch = () => {
    setLoading(true);
    console.log({
      employee,
      company,
      project,
      fromDate: fromDate ? fromDate.toISOString().slice(0, 10) : null,
      toDate: toDate ? toDate.toISOString().slice(0, 10) : null,
    });
    // call your API here
    setTimeout(() => setLoading(false), 600); // remove — placeholder for real request
  };

  const handleReset = () => {
    setEmployee(null);
    setCompany(null);
    setProject(null);
    setFromDate(dayjs());
    setToDate(dayjs());
  };

  const handleDownload = () => {
    console.log("Download Excel triggered");
    // export logic here
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Navbar>
        <Box
          sx={{
            bgcolor: tokens.canvas,
            minHeight: "100%",
            p: { xs: 2, md: 4 },
          }}
        >
          {/* Page header */}
          <Grid
            sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
          >
            <Grid>
              <Stack direction='row' alignItems='center' spacing={1.75}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: "#36435f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <AssignmentIcon sx={{ color: "white", fontSize: 22 }} />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontFamily: FONT_DISPLAY,
                      fontWeight: 600,
                      fontSize: { xs: 20, sm: 23 },
                      letterSpacing: "-0.01em",
                      color: tokens.ink,
                      lineHeight: 1.2,
                    }}
                  >
                    Task Report
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: FONT_BODY,
                      fontSize: 13.5,
                      color: tokens.slate,
                      mt: 0.25,
                    }}
                  >
                    Logged work across employees, companies, and projects
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid>
              <Chip
                icon={
                  <ScheduleIcon
                    sx={{
                      fontSize: 16,
                      color: `${tokens.slate} !important`,
                    }}
                  />
                }
                label={`${formatDate(fromDate)} – ${formatDate(toDate)}`}
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: 13,
                  fontWeight: 500,
                  color: tokens.slate,
                  bgcolor: tokens.surface,
                  border: `1px solid ${tokens.hairline}`,
                  borderRadius: 1.5,
                  px: 0.5,
                }}
              />
            </Grid>
          </Grid>

          {/* Filters card */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 2.5,
              border: `1px solid ${tokens.hairline}`,
              bgcolor: tokens.surface,
            }}
          >
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              mb={2.25}
            >
              <Typography
                sx={{
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: 11.5,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: tokens.slate,
                  mb: 1,
                }}
              >
                Filters
              </Typography>
              {activeFilterCount > 0 && (
                <Chip
                  label={`${activeFilterCount} active`}
                  size='small'
                  sx={{
                    fontFamily: FONT_BODY,
                    fontSize: 11.5,
                    fontWeight: 600,
                    height: 22,
                    bgcolor: tokens.accentSoft,
                    color: tokens.accent,
                  }}
                />
              )}
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ lg: 2.4, md: 12, sm: 12, xs: 12 }}>
                <Autocomplete
                  options={employeeOptions}
                  value={employee}
                  onChange={(e, newValue) => setEmployee(newValue)}
                  slotProps={{
                    paper: {
                      sx: {
                        "& .MuiAutocomplete-option": {
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "13px",
                        },
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Employee'
                      size='small'
                      sx={FIELD_SX}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ lg: 2.4, md: 12, sm: 12, xs: 12 }}>
                <Autocomplete
                  options={companyOptions}
                  value={company}
                  onChange={(e, newValue) => setCompany(newValue)}
                  slotProps={{
                    paper: {
                      sx: {
                        "& .MuiAutocomplete-option": {
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "13px",
                        },
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Company'
                      size='small'
                      sx={FIELD_SX}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ lg: 2.4, md: 12, sm: 12, xs: 12 }}>
                <Autocomplete
                  options={projectOptions}
                  value={project}
                  onChange={(e, newValue) => setProject(newValue)}
                  slotProps={{
                    paper: {
                      sx: {
                        "& .MuiAutocomplete-option": {
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "13px",
                        },
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Project'
                      size='small'
                      sx={FIELD_SX}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ lg: 2.4, md: 12, sm: 12, xs: 12 }}>
                <DatePicker
                  label='From date'
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  maxDate={toDate || undefined}
                  slotProps={{
                    textField: { size: "small", fullWidth: true, sx: FIELD_SX },
                  }}
                />
              </Grid>

              <Grid size={{ lg: 2.4, md: 12, sm: 12, xs: 12 }}>
                <DatePicker
                  label='To date'
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  minDate={fromDate || undefined}
                  slotProps={{
                    textField: { size: "small", fullWidth: true, sx: FIELD_SX },
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2.5, borderColor: tokens.hairline }} />

            {/* Buttons */}
            <Grid sx={{ display: "flex", gap: 2 }}>
              <Grid>
                <Button
                  variant='text'
                  startIcon={<RestartAltIcon sx={{ fontSize: 18 }} />}
                  onClick={handleReset}
                  sx={{
                    fontFamily: FONT_BODY,
                    fontWeight: 600,
                    fontSize: 13.5,
                    textTransform: "none",
                    color: tokens.slate,
                    "&:hover": { bgcolor: tokens.canvas },
                  }}
                >
                  Reset
                </Button>
              </Grid>

              <Grid>
                <Button
                  variant='outlined'
                  startIcon={
                    <SearchIcon sx={{ fontSize: 18, color: tokens.brand }} />
                  }
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{
                    fontFamily: FONT_BODY,
                    fontWeight: 600,
                    fontSize: 13.5,
                    textTransform: "none",
                    px: 2.75,
                    borderRadius: 1.5,
                    background: tokens.surface,
                    borderColor: tokens.brand,
                    color: tokens.brand,
                    boxShadow: "none",
                    "&:hover": {
                      background: "#FDECEF",
                      borderColor: tokens.brandHover,
                      boxShadow: "none",
                    },
                  }}
                >
                  Search
                </Button>
              </Grid>

              <Grid>
                <Button
                  variant='contained'
                  startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
                  onClick={handleDownload}
                  disabled={loading || rows.length === 0}
                  sx={{
                    fontFamily: FONT_BODY,
                    fontWeight: 600,
                    fontSize: 13.5,
                    textTransform: "none",
                    px: 2.75,
                    borderRadius: 1.5,
                    background: tokens.brand,
                    boxShadow: "none",
                    "&:hover": {
                      background: tokens.brandHover,
                      boxShadow: "none",
                    },
                  }}
                >
                  Download Excel
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Results summary bar */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent='space-between'
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
            sx={{ mt: 3, mb: 1.5, px: 0.5 }}
          >
            <Typography
              sx={{
                fontFamily: FONT_BODY,
                fontSize: 13.5,
                color: tokens.slate,
              }}
            >
              <Box component='span' sx={{ fontWeight: 700, color: tokens.ink }}>
                {rows.length}
              </Box>{" "}
              {rows.length === 1 ? "entry" : "entries"} found
            </Typography>

            <Stack direction='row' alignItems='baseline' spacing={0.75}>
              <Typography
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: 12.5,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: tokens.slate,
                }}
              >
                Total hours
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 20,
                  fontWeight: 700,
                  color: tokens.accent,
                  lineHeight: 1,
                }}
              >
                {totalHours}
              </Typography>
            </Stack>
          </Stack>

          {/* Table */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 2.5,
              border: `1px solid ${tokens.hairline}`,
              maxHeight: 480,
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "Sl. No",
                    "Date",
                    "Project",
                    "Task",
                    "Hours",
                    "Comments",
                  ].map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        fontFamily: FONT_BODY,
                        fontWeight: 700,
                        fontSize: 12,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        bgcolor: tokens.canvas,
                        color: tokens.slate,
                        borderBottom: `1px solid ${tokens.hairline}`,
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align='center'
                      sx={{ py: 7, border: "none" }}
                    >
                      {/* <Stack alignItems='center' spacing={1.5}> */}
                      <CircularProgress
                        size={26}
                        thickness={4}
                        sx={{ color: tokens.accent }}
                      />
                      <Typography
                        sx={{
                          fontFamily: FONT_BODY,
                          fontSize: 13,
                          color: tokens.slate,
                        }}
                      >
                        Fetching report…
                      </Typography>
                      {/* </Stack> */}
                    </TableCell>
                  </TableRow>
                ) : rows.length > 0 ? (
                  rows.map((row, index) => (
                    <Fade in key={index} timeout={250 + index * 60}>
                      <TableRow
                        hover
                        sx={{
                          "&:nth-of-type(even)": { bgcolor: "#FBFBFD" },
                          "&:hover": { bgcolor: tokens.accentSoft },
                        }}
                      >
                        <TableCell
                          sx={{
                            fontFamily: FONT_BODY,
                            fontSize: 13.5,
                            color: tokens.slate,
                            borderColor: tokens.hairline,
                          }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: FONT_BODY,
                            fontSize: 13.5,
                            color: tokens.ink,
                            borderColor: tokens.hairline,
                          }}
                        >
                          {formatDate(row.date)}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: FONT_BODY,
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: tokens.ink,
                            borderColor: tokens.hairline,
                          }}
                        >
                          -
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: FONT_BODY,
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: tokens.ink,
                            borderColor: tokens.hairline,
                          }}
                        >
                          {row.task}
                        </TableCell>
                        <TableCell sx={{ borderColor: tokens.hairline }}>
                          <Chip
                            label={`${row.hours}h`}
                            size='small'
                            sx={{
                              fontFamily: FONT_BODY,
                              fontWeight: 700,
                              fontSize: 12.5,
                              minWidth: 54,
                              bgcolor:
                                Number(row.hours) >= 8
                                  ? tokens.goodSoft
                                  : tokens.warnSoft,
                              color:
                                Number(row.hours) >= 8
                                  ? tokens.good
                                  : tokens.warn,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: FONT_BODY,
                            fontSize: 13.5,
                            color: tokens.slate,
                            borderColor: tokens.hairline,
                          }}
                        >
                          {row.comments}
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align='center'
                      sx={{ py: 7, border: "none" }}
                    >
                      <Stack alignItems='center' spacing={1}>
                        <InboxOutlinedIcon
                          sx={{ fontSize: 30, color: tokens.hairline }}
                        />
                        <Typography
                          sx={{
                            fontFamily: FONT_BODY,
                            fontWeight: 600,
                            fontSize: 14,
                            color: tokens.ink,
                          }}
                        >
                          No records found
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: FONT_BODY,
                            fontSize: 13,
                            color: tokens.slate,
                          }}
                        >
                          Try widening the date range or clearing a filter
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Navbar>
    </LocalizationProvider>
  );
};

export default ReportTable;
