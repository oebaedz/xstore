import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const RegLayout = ({ children }) => {
  return (
    <div>
        <Navbar />
        <Outlet />
        <Footer />
    </div>
  );
}

export default RegLayout;