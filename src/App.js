import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import UserContext from "./UseContext/UserContext";
import Login from "./Components/Pages/Login";
import MainPage from "./Components/Pages/Users/MainPage";
import TimeSheetEntry from "./Components/Pages/TimeSheet/TimeSheetEntry";
import ErrorHandling from "./ErrorHandling/ErrorHandling";
import Clientpage from "./Components/Pages/Clients/Clientspage";
import ProjectsPage from "./Components/Pages/Projects/ProjectsPage";
import Dashboard from "./Components/Pages/Dashboard/Dashboard";
import Workunit from "./Components/Pages/Workunit/Workunit";

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ loading, setLoading }}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Dashboard' element={<Dashboard />} />
          <Route path='/Workunit' element={<Workunit />} />
          <Route path='/Users' element={<MainPage />} />
          <Route path='/Clientpage' element={<Clientpage />} />
          <Route path='/ProjectsPage' element={<ProjectsPage />} />
          <Route path='/TimeSheetEntry' element={<TimeSheetEntry />} />
          <Route path='/ErrorHandling' element={<ErrorHandling />} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
