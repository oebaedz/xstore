import logo from '../assets/Logo.svg';

const Footer = () => {
  return (
    <footer className="py-10 gap-1 flex flex-col items-center bg-white dark:bg-gray-900 dark:text-gray-300">
      <div className="avatar">
        <div className="w-24">
          <img src={logo} alt='logo' />
        </div>
      </div>
      <p className="dark:text-gray-400">Created by <a className='hover:text-red-500 dark:text-white dark:hover:text-red-400' href="https://instagram.com/oebaedz">Zbad</a>, IKSADA Creative Team</p>
      <p className="dark:text-gray-400">© 2024. All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
