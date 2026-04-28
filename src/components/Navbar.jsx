import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <div className="navbar">
      <h3>Welcome, {user?.role?.toUpperCase()}</h3>
      <div>👤 {user?.email}</div>
    </div>
  );
}

export default Navbar;