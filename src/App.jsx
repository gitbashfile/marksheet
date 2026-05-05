import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./pages/authentication/login";

function App() {

  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    return <Login />;
  }

  return (
    <div className="layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
