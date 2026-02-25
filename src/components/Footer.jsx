import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-8 gap-1 flex flex-col items-center bg-primary">
      <div>
        <div className="w-20 mb-2">
          <img src="/Logo.webp" alt="logo" className="w-full object-contain" />
        </div>
      </div>
      <p className="text-white">Created by <a className='hover:text-yellow' href="https://instagram.com/oebaedz">Zbad</a>, <Link to="/dashboard">IKSADA</Link> Creative Team</p>
      <p className="text-gray-200">© 2026. All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
