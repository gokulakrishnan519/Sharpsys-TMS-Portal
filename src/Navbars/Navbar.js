import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Dialog,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import PersonIcon from "@mui/icons-material/Person";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

import main_logo from "../Images/Main_logo.png";
import { useLocation, useNavigate } from "react-router-dom";

import AddTaskIcon from "@mui/icons-material/AddTask";

const drawerWidth = 250;

const menuItems = [
  {
    section: "ADMIN",
    items: [
      // { text: "Dashboard", icon: <DashboardOutlinedIcon />, path: "Dashboard" },
      // { text: "Work Unit", icon: <DashboardOutlinedIcon />, path: "Workunit" },
      { text: "Users", icon: <DashboardOutlinedIcon />, path: "users" },
      { text: "Clients", icon: <PersonIcon />, path: "Clientpage" },
      { text: "Project", icon: <CreateNewFolderIcon />, path: "ProjectsPage" },
      { text: "Task", icon: <AddTaskIcon />, path: "TaskMainPage" },
    ],
  },

  {
    section: "TIMESHEET",
    items: [
      {
        text: "My Timesheet",
        icon: <FolderOpenOutlinedIcon />,
        path: "TimeSheetEntry",
      },
    ],
  },
];

const Navbar = ({ children }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!sessionStorage.getItem("departmentId")) {
      navigate("/");
    }
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant='permanent'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#36435f",
            color: "#fff",
            borderRight: "none",
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            padding: 1.5,
          }}
        >
          <Box
            component='img'
            src={main_logo}
            alt='logo'
            sx={{
              width: 200,
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Menu */}
        <List
          sx={{
            mt: 2,
            px: 1,
          }}
        >
          {menuItems.map((section, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              {/* Section Title */}
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  mb: 1.5,
                  pl: 1,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {section.section}
              </Typography>

              {/* Menu Items */}
              {section.items.map((item, idx) => {
                const isActive = location.pathname === `/${item.path}`; // ← active check

                return (
                  <ListItemButton
                    key={idx}
                    onClick={() => {
                      sessionStorage.setItem("page_name", item.text);
                      navigate(`/${item.path}`);
                    }}
                    sx={{
                      borderRadius: "10px",
                      mb: 0.5,
                      py: 1,
                      px: 1.2,
                      color: "#fff",

                      // ✅ Active styles
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.15)"
                        : "transparent",
                      borderLeft: isActive
                        ? "3px solid #7f9cf5"
                        : "3px solid transparent",

                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.08)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        // ✅ Icon color active/inactive
                        color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                        minWidth: "34px",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "15px",
                        // ✅ Text color active/inactive
                        color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {item.text}
                    </Typography>
                  </ListItemButton>
                );
              })}
            </Box>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Navbar */}

        <AppBar
          position='fixed'
          elevation={0}
          sx={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            color: "#000",
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minHeight: "70px",
            }}
          >
            <Typography
              variant='h5'
              sx={{
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {sessionStorage.getItem("page_name")}
            </Typography>

            <Box display='flex' alignItems='center' gap={2}>
              {/* <IconButton>
                <SearchIcon sx={{ fontSize: 28, color: "#222" }} />
              </IconButton>

              <IconButton>
                <NotificationsNoneIcon
                  sx={{ fontSize: 28, color: "#ff2d55" }}
                />
              </IconButton> */}

              <IconButton onClick={handleOpen}>
                <AccountCircleOutlinedIcon
                  sx={{ fontSize: 28, color: "#2e2e2e" }}
                />
              </IconButton>
              <Dialog
                open={open}
                onClose={handleClose}
                maxWidth='xs'
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: 3,
                    p: 1,
                  },
                }}
              >
                <DialogTitle
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: 600,
                    fontFamily: "Poppins",
                  }}
                >
                  <LogoutOutlinedIcon color='error' />
                  Confirm Logout
                </DialogTitle>

                <DialogContent>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ fontFamily: "Poppins" }}
                  >
                    Are you sure you want to log out?
                  </Typography>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                  <Button
                    onClick={handleClose}
                    variant='outlined'
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      minWidth: 90,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant='contained'
                    color='error'
                    onClick={() => {
                      sessionStorage.clear();
                      navigate("/");
                    }}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      minWidth: 90,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Logout
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          sx={{
            backgroundColor: "#f3f6fb",
            minHeight: "100vh",
            mt: "60px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
