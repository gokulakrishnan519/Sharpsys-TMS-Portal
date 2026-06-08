import React, { useState, useMemo } from "react";
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
  LinearProgress,
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
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import UserEntry from "./Modal/UserEntry";

// ── constants ────────────────────────────────────────────────────────────────

const FONT = "'Poppins', sans-serif";
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS = {
  Present: {
    bg: "#F0FDF4",
    text: "#15803D",
    border: "#BBF7D0",
    dot: "#22C55E",
  },
  Leave: { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA", dot: "#F97316" },
  Absent: { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3", dot: "#FB7185" },
};

// ── helpers ──────────────────────────────────────────────────────────────────

function dayKey(y, m, d) {
  return `${y}-${m}-${d}`;
}

function buildMap(rawWeeks, year, month) {
  const map = {};
  rawWeeks.flat().forEach((cell) => {
    if (!cell.day) return;
    const status = cell.entries?.[0]?.status ?? null;
    map[dayKey(year, month, cell.day)] = {
      status,
      entries: cell.entries ?? [],
    };
  });
  return map;
}

function buildGrid(year, month, data) {
  const first = dayjs(`${year}-${month + 1}-01`).day();
  const total = dayjs(`${year}-${month + 1}-01`).daysInMonth();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= total; d++) {
    const k = dayKey(year, month, d);
    cells.push({ day: d, ...(data[k] || { status: null, entries: [] }) });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
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
          width: `${100 / 7}%`,
          height: 108,
          border: "1px solid #F1F5F9",
          bgcolor: "#FAFBFC",
          p: 0,
        }}
      />
    );
  }

  const cfg = cell.status ? STATUS[cell.status] : null;
  const shown = cell.entries?.slice(0, 2) ?? [];
  const extra = (cell.entries?.length ?? 0) - 2;
  const isLeaveAbsent = cell.status === "Leave" || cell.status === "Absent";

  return (
    <TableCell
      onClick={onClick}
      sx={{
        width: `${100 / 7}%`,
        minWidth: `${100 / 7}%`,
        maxWidth: `${100 / 7}%`,
        height: 108,
        border: "1px solid #F1F5F9",
        verticalAlign: "top",
        cursor: "pointer",
        p: "8px",
        bgcolor: isWeekend ? "#FAFBFC" : "#fff",
        position: "relative",
        transition: "background 0.15s",
        "&:hover": {
          bgcolor: "#F8FAFF",
          "& .add-hint": { opacity: 1 },
        },
      }}
    >
      {/* Today top accent line */}
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

      {/* Leave / Absent chip */}
      {isLeaveAbsent && cfg && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: "6px",
            py: "4px",
            bgcolor: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: "7px",
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
              color: cfg.text,
            }}
          >
            {cell.status}
          </Typography>
        </Box>
      )}

      {/* Work entries */}
      {!isLeaveAbsent &&
        shown.map((entry, i) => {
          const ecfg = STATUS[entry.status] ?? STATUS.Present;
          return (
            <Box
              key={i}
              sx={{
                mb: "3px",
                px: "6px",
                py: "4px",
                bgcolor: ecfg.bg,
                border: `1px solid ${ecfg.border}`,
                borderRadius: "7px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.62rem",
                  fontFamily: FONT,
                  fontWeight: 600,
                  color: ecfg.text,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {entry.project || entry.status}
              </Typography>
              {entry.hours > 0 && (
                <Typography
                  sx={{
                    fontSize: "0.57rem",
                    fontFamily: FONT,
                    color: ecfg.text,
                    opacity: 0.75,
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

      {/* Hover hint for empty weekday */}
      {!cell.status && !isWeekend && (
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

// ── main component ────────────────────────────────────────────────────────────

export default function TimeSheetEntry() {
  const today = dayjs();
  const [selectionDate, setSelectionDate] = useState(dayjs());
  const [open1, setOpen1] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const year = selectionDate.year();
  const month = selectionDate.month(); // 0-indexed

  const [dayData] = useState(() =>
    buildMap(
      [
        [
          { day: null, entries: [] },
          { day: null, entries: [] },
          {
            day: 1,
            entries: [
              { project: "Vendor Portal", hours: 8, status: "Present" },
            ],
          },
          {
            day: 2,
            entries: [
              { project: "JWT Integration", hours: 7, status: "Present" },
            ],
          },
          { day: 3, entries: [{ project: "", hours: 0, status: "Leave" }] },
          {
            day: 4,
            entries: [
              { project: "Dashboard UI", hours: 4, status: "Present" },
              { project: "API Testing", hours: 3, status: "Present" },
            ],
          },
          { day: 5, entries: [] },
        ],
        [
          {
            day: 6,
            entries: [{ project: "Bug Fixing", hours: 8, status: "Present" }],
          },
          { day: 7, entries: [] },
          { day: 8, entries: [{ project: "", hours: 0, status: "Leave" }] },
          {
            day: 9,
            entries: [
              { project: "Timesheet Module", hours: 5, status: "Present" },
              { project: "Testing", hours: 2, status: "Present" },
              { project: "Testing", hours: 2, status: "Present" },
              { project: "Testing", hours: 2, status: "Present" },
              { project: "Testing", hours: 2, status: "Present" },
            ],
          },
          { day: 10, entries: [] },
          { day: 11, entries: [] },
          { day: 12, entries: [] },
        ],
      ],
      year,
      month,
    ),
  );

  const stats = useMemo(() => {
    const total = selectionDate.daysInMonth();
    let working = 0,
      present = 0,
      leaves = 0,
      hours = 0;
    for (let d = 1; d <= total; d++) {
      const dow = dayjs(`${year}-${month + 1}-${d}`).day();
      if (dow !== 0 && dow !== 6) working++;
      const data = dayData[dayKey(year, month, d)];
      if (data?.status === "Present") {
        present++;
        data.entries.forEach((e) => (hours += e.hours || 0));
      }
      if (data?.status === "Leave") leaves++;
    }
    const attendance = working > 0 ? Math.round((present / working) * 100) : 0;
    return { working, present, leaves, hours, attendance };
  }, [dayData, selectionDate, year, month]);

  const grid = useMemo(
    () => buildGrid(year, month, dayData),
    [dayData, year, month],
  );

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
                "&:hover": { bgcolor: "#F1F5F9", borderColor: "#CBD5E1" },
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
                "&:hover": { bgcolor: "#F1F5F9", borderColor: "#CBD5E1" },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: "1rem", color: "#64748B" }} />
            </IconButton>
          </Box>
        </Box>

        {/* ── Summary Cards ── */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
          <SummaryCard
            icon={<CalendarMonthIcon />}
            label='Working Days'
            value={stats.working}
            color='#6366F1'
          />
          <SummaryCard
            icon={<EventBusyIcon />}
            label='Present'
            value={stats.present}
            color='#22C55E'
          />
          <SummaryCard
            icon={<EventBusyIcon />}
            label='Leaves'
            value={stats.leaves}
            color='#F97316'
          />
          <SummaryCard
            icon={<AccessTimeIcon />}
            label='Total Hours'
            value={stats.hours}
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
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow>
                {WEEK_DAYS.map((d, i) => (
                  <TableCell
                    key={d}
                    align='center'
                    sx={{
                      fontWeight: 600,
                      fontFamily: FONT,
                      fontSize: "0.7rem",
                      color: i === 0 || i === 6 ? "#CBD5E1" : "#64748B",
                      letterSpacing: "0.05em",
                      py: 1.4,
                      border: "none",
                      bgcolor: "#FAFBFC",
                      borderBottom: "1.5px solid #F1F5F9",
                    }}
                  >
                    {d}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {grid.map((week, wi) => (
                <TableRow key={wi}>
                  {week.map((cell, ci) => {
                    if (!cell) {
                      return (
                        <TableCell
                          key={ci}
                          sx={{
                            width: `${100 / 7}%`,
                            height: 108,
                            border: "1px solid #F1F5F9",
                            bgcolor: "#FAFBFC",
                            p: 0,
                          }}
                        />
                      );
                    }
                    const isToday =
                      cell.day === today.date() &&
                      month === today.month() &&
                      year === today.year();
                    const dow = dayjs(`${year}-${month + 1}-${cell.day}`).day();
                    return (
                      <DayCell
                        key={ci}
                        cell={cell}
                        isToday={isToday}
                        isWeekend={dow === 0 || dow === 6}
                        onClick={() => {
                          setSelectedDay(cell.day);
                          setOpen1(true);
                        }}
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
          {Object.entries(STATUS).map(([label, cfg]) => (
            <Box
              key={label}
              sx={{ display: "flex", alignItems: "center", gap: 0.6 }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: cfg.dot,
                }}
              />
              <Typography
                sx={{ fontSize: "0.68rem", fontFamily: FONT, color: "#94A3B8" }}
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
              // width: { xs: "95%", sm: "80%", md: "65%" },
              width: "90%",
              bgcolor: "#fff",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
              outline: "none",
            }}
          >
            {/* Modal Header */}
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                borderBottom: "1.5px solid #F1F5F9",
                bgcolor: "#FAFBFC",
              }}
            >
              <IconButton
                size='small'
                onClick={() => setOpen1(false)}
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

            {/* Modal Body */}
            <Box sx={{ p: 4.7 }}>
              <UserEntry />
            </Box>
          </Box>
        </Modal>
      </Box>
    </Navbar>
  );
}
