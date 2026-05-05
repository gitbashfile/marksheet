import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Student from "./pages/studetns/student";
import Consolidation from "./pages/consolidation/consolidation";
import Configuration from "./pages/configuration/configuration";
import EnterMarks from "./pages/entermarks/entermarks";
import Marksheets from "./pages/marksheets/marksheet";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Marksheets />
      },
      {
        path: '/students', 
        element: <Student />
      },
      {
        path: '/consolidation',
        element: <Consolidation />
      },
      {
        path: '/configuration',
        element: <Configuration />
      },
      {
        path: '/entermarks', 
        element: <EnterMarks />
      },
        {
        path: '/marksheet',   
        element: <Marksheets />
      },
    ]
  }
])