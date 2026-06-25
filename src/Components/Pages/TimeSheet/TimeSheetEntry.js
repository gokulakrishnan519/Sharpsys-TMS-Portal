import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Modal,
  IconButton,
  Paper,
  Avatar,
} from "@mui/material";
import dayjs from "dayjs";
import Navbar from "../../../Navbars/Navbar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import UserEntry from "./Modal/UserEntry";
import axios from "axios";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

// ── constants ────────────────────────────────────────────────────────────────

const FONT = "'Poppins', sans-serif";
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CHIP = {
  Timesheet: { bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5" },
  Permission: { bg: "#FAEEDA", color: "#633806", dot: "#BA7517" },
  Leave: { bg: "#FCEBEB", color: "#791F1F", dot: "#A32D2D" },
  default: { bg: "#EEEDFE", color: "#3C3489", dot: "#534AB7" },
};

// ── helpers ──────────────────────────────────────────────────────────────────

function buildCalendar(apiData) {
  const firstDay = dayjs(`${apiData.year}-${apiData.month}-01`).day();
  const calendar = [];
  let week = [];

  for (let i = 0; i < firstDay; i++) week.push(null);

  apiData.days.forEach((item) => {
    week.push(item);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  });

  while (week.length > 0 && week.length < 7) week.push(null);
  if (week.length) calendar.push(week);

  return calendar;
}

function computeSummary(days) {
  let present = 0,
    leaves = 0,
    totalHours = 0;

  days.forEach(({ entries }) => {
    if (!entries.length) return;

    const hasLeave = entries.some((e) => e.requestType === "Leave");
    const hasTimesheet = entries.some((e) => e.requestType === "Timesheet");

    if (hasLeave) leaves++;
    else if (hasTimesheet) present++;

    entries.forEach((e) => {
      if (e.hours) totalHours += e.hours;
    });
  });

  return { present, leaves, totalHours };
}

// ── SummaryCard ──────────────────────────────────────────────────────────────

function SummaryCard({ icon, label, value, color, sub }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 130,
        display: "flex",
        alignItems: "center",
        gap: 2,
        bgcolor: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: "18px",
        px: 3,
        py: 2.2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <Avatar
        sx={{
          width: 38,
          height: 38,
          bgcolor: `${color}18`,
          borderRadius: "10px",
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: "1.1rem", color } })}
      </Avatar>
      <Box>
        <Typography
          sx={{
            fontSize: "0.62rem",
            fontFamily: FONT,
            color: "#94A3B8",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.4 }}>
          <Typography
            sx={{
              fontSize: "1.35rem",
              fontFamily: FONT,
              fontWeight: 700,
              color: "#0F172A",
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>
          {sub && (
            <Typography
              sx={{ fontSize: "0.62rem", fontFamily: FONT, color: "#94A3B8" }}
            >
              {sub}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ── DayCell ──────────────────────────────────────────────────────────────────

function DayCell({ cell, isToday, isWeekend, onClick }) {
  if (!cell) {
    return (
      <TableCell
        sx={{
          height: 108,
          border: "1px solid #F1F5F9",
          bgcolor: "#FAFBFC",
          p: 0,
        }}
      />
    );
  }

  const entries = cell.entries ?? [];
  const shown = entries.slice(0, 2);
  const extra = entries.length - 2;

  console.log(cell?.workDate);

  const isFutureDate = dayjs(cell?.workDate).isAfter(dayjs(), "day");

  return (
    <TableCell
      onClick={!isFutureDate ? onClick : undefined}
      sx={{
        height: 108,
        border: "1px solid #F1F5F9",
        verticalAlign: "top",
        cursor: cell.entries[0]?.requestType == "Leave" ? "" : "pointer",
        p: "8px",
        bgcolor: isWeekend ? "#FAFBFC" : "#fff",
        position: "relative",
        transition: "background 0.15s",
        "&:hover": { bgcolor: "#F8FAFF", "& .add-hint": { opacity: 1 } },
      }}
    >
      {/* Today accent */}
      {isToday && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            bgcolor: "#6366F1",
          }}
        />
      )}

      {/* Day number */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: "4px" }}>
        <Box
          sx={{
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            bgcolor: isToday ? "#6366F1" : "transparent",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontFamily: FONT,
              fontWeight: isToday ? 700 : 500,
              color: isToday ? "#fff" : isWeekend ? "#CBD5E1" : "#94A3B8",
            }}
          >
            {cell.day}
          </Typography>
        </Box>
      </Box>

      {/* Entry chips */}
      {shown.map((entry) => {
        const cfg = CHIP[entry.requestType] ?? CHIP.default;
        const label = entry.project || entry.requestType;

        return (
          <Box
            key={entry.id}
            sx={{
              mb: "3px",
              px: "6px",
              py: "3px",
              bgcolor: cfg.bg,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                bgcolor: cfg.dot,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.62rem",
                fontFamily: FONT,
                fontWeight: 600,
                color: cfg.color,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {label}
            </Typography>
            {entry.hours > 0 && (
              <Typography
                sx={{
                  fontSize: "0.57rem",
                  fontFamily: FONT,
                  color: cfg.color,
                  opacity: 0.7,
                  ml: "auto",
                  flexShrink: 0,
                }}
              >
                {entry.hours}h
              </Typography>
            )}
          </Box>
        );
      })}

      {extra > 0 && (
        <Typography
          sx={{
            fontSize: "0.58rem",
            fontFamily: FONT,
            color: "#94A3B8",
            pl: "2px",
          }}
        >
          +{extra} more
        </Typography>
      )}

      {/* Hover hint */}
      {!entries.length && !isWeekend && (
        <Typography
          className='add-hint'
          sx={{
            fontSize: "0.6rem",
            fontFamily: FONT,
            color: "#CBD5E1",
            opacity: 0,
            transition: "opacity 0.15s",
            mt: 0.5,
          }}
        >
          + Add entry
        </Typography>
      )}
    </TableCell>
  );
}

// ── main ─────────────────────────────────────────────────────────────────────

export default function TimeSheetEntry() {
  const today = dayjs();
  const [selectionDate, setSelectionDate] = useState(dayjs());
  const [open1, setOpen1] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendarRows, setCalendarRows] = useState([]);
  const [summary, setSummary] = useState({
    present: 0,
    leaves: 0,
    totalHours: 0,
  });
  const [loading, setLoading] = useState(false);
  const [passData, setPassData] = useState(null);

  const fetchTimesheet = () => {
    setLoading(true);
    axios
      .post("http://10.10.0.108:8000/timesheet/calendar", {
        year: selectionDate.year(),
        month: selectionDate.format("MM"),
        employeeId: sessionStorage.getItem("employeeId"),
      })
      .then((res) => {
        setCalendarRows(buildCalendar(res.data));
        setSummary(computeSummary(res.data.days));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTimesheet();
  }, [selectionDate]);

  const handleDayClick = (cell) => {
    if (!cell) return;
    if (cell.entries[0]?.requestType == "Leave") {
      return;
    }

    console.log(cell);

    setSelectedDay(cell);
    setPassData(cell);
    setOpen1(true);
  };

  return (
    <Navbar>
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2.5,
          bgcolor: "#F1F5F9",
          minHeight: "100vh",
        }}
      >
        {/* ── Header ── */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2.5,
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: 700,
                fontFamily: FONT,
                color: "#0F172A",
              }}
            >
              {selectionDate.format("MMMM YYYY")}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontFamily: FONT,
                color: "#94A3B8",
                mt: 0.2,
              }}
            >
              Timesheet · {selectionDate.format("YYYY")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <IconButton
              size='small'
              onClick={() => setSelectionDate((d) => d.subtract(1, "month"))}
              sx={{
                border: "1.5px solid #E2E8F0",
                borderRadius: "9px",
                width: 32,
                height: 32,
                "&:hover": { bgcolor: "#F1F5F9" },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: "1rem", color: "#64748B" }} />
            </IconButton>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year", "month"]}
                format='YYYY-MM'
                value={selectionDate}
                onChange={(d) => d && setSelectionDate(d)}
                slotProps={{ textField: { size: "small" } }}
                sx={{
                  width: 130,
                  "& .MuiOutlinedInput-root": {
                    height: "32px !important",
                    borderRadius: "9px",
                    fontFamily: FONT,
                    bgcolor: "#fff",
                    "& fieldset": {
                      borderColor: "#E2E8F0",
                      borderWidth: "1.5px",
                    },
                    "&:hover fieldset": { borderColor: "#6366F1" },
                  },
                  "& .MuiInputBase-input": {
                    padding: "4px 6px !important",
                    fontSize: "0.72rem",
                    fontFamily: FONT,
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.1rem",
                    color: "#64748B",
                  },
                }}
              />
            </LocalizationProvider>

            <IconButton
              size='small'
              onClick={() => setSelectionDate((d) => d.add(1, "month"))}
              sx={{
                border: "1.5px solid #E2E8F0",
                borderRadius: "9px",
                width: 32,
                height: 32,
                "&:hover": { bgcolor: "#F1F5F9" },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: "1rem", color: "#64748B" }} />
            </IconButton>
          </Box>
        </Box>

        {/* ── Summary Cards ── */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
          <SummaryCard
            icon={<BusinessCenterIcon />}
            label='Present'
            value={summary.present}
            color='#22C55E'
          />
          <SummaryCard
            icon={<BeachAccessOutlinedIcon />}
            label='Leaves'
            value={summary.leaves}
            color='#F97316'
          />
          <SummaryCard
            icon={<AccessTimeIcon />}
            label='Total Hours'
            value={summary.totalHours}
            color='#0EA5E9'
            sub='hrs'
          />
        </Box>

        {/* ── Calendar ── */}
        <Paper
          elevation={0}
          sx={{
            border: "1.5px solid #F1F5F9",
            borderRadius: "16px",
            overflow: "hidden",
            bgcolor: "#fff",
          }}
        >
          {loading && (
            <Box
              sx={{
                height: 3,
                bgcolor: "#6366F1",
                animation: "pulse 1s infinite",
              }}
            />
          )}

          <Table
            sx={{
              borderCollapse: "collapse",
              tableLayout: "fixed",
              width: "100%",
            }}
          >
            <TableHead>
              <TableRow>
                {WEEK_DAYS.map((day, i) => (
                  <TableCell
                    key={day}
                    align='center'
                    sx={{
                      fontFamily: FONT,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: i === 0 || i === 6 ? "#CBD5E1" : "#64748B",
                      bgcolor: "#FAFBFC",
                      border: "1px solid #F1F5F9",
                      py: 1.2,
                    }}
                  >
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {calendarRows.map((week, wi) => (
                <TableRow key={wi}>
                  {week.map((cell, ci) => {
                    const isToday =
                      cell &&
                      today.date() === cell.day &&
                      today.month() === selectionDate.month() &&
                      today.year() === selectionDate.year();
                    const isWeekend = ci === 0 || ci === 6;

                    return (
                      <DayCell
                        key={ci}
                        cell={cell}
                        isToday={isToday}
                        isWeekend={isWeekend}
                        onClick={() => handleDayClick(cell)}
                      />
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* ── Legend ── */}
        <Box sx={{ display: "flex", gap: 2.5, mt: 1.5, flexWrap: "wrap" }}>
          {Object.entries(CHIP)
            .filter(([k]) => k !== "default")
            .map(([label, cfg]) => (
              <Box
                key={label}
                sx={{ display: "flex", alignItems: "center", gap: 0.6 }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    bgcolor: cfg.dot,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontFamily: FONT,
                    color: "#94A3B8",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
        </Box>

        {/* ── Modal ── */}
        <Modal open={open1} onClose={() => setOpen1(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "99%",
              bgcolor: "#fff",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
              outline: "none",
            }}
          >
            <Box sx={{ position: "absolute", top: 10, right: 10 }}>
              <IconButton
                size='small'
                onClick={() => {
                  setOpen1(false);
                  fetchTimesheet();
                }}
                sx={{
                  bgcolor: "#F1F5F9",
                  border: "1.5px solid #E2E8F0",
                  borderRadius: "9px",
                  width: 32,
                  height: 32,
                  "&:hover": { bgcolor: "#E2E8F0" },
                }}
              >
                <CloseOutlinedIcon
                  sx={{ fontSize: "1rem", color: "#64748B" }}
                />
              </IconButton>
            </Box>
            <Box sx={{ p: 4.7 }}>
              <UserEntry
                day={selectedDay}
                onClose={() => setOpen1(false)}
                passData={passData}
              />
            </Box>
          </Box>
        </Modal>
      </Box>
    </Navbar>
  );
}
