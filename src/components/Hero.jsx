import { Link } from "react-router-dom";
import hero from "../assets/catalog.jpg";

const Hero = () => {
  return (
    <div className="hero min-h-screen bg-base-200 px-4 dark:bg-gray-900">
      <div className="hero-content flex-col lg:flex-row">
        <div className="pt-20">
          <h1 className="text-xl md:text-5xl font-medium text-gray-800 dark:text-white">
            Pre Order Foto Masyayikh
          </h1>
          <h1 className="text-md md:text-2xl mt-2 font-medium text-gray-700 dark:text-gray-200">
            Chapter II | 01-30 April 2024
          </h1>
          <p className="py-6 md:text-xl font-light md:mr-44 text-gray-600 dark:text-gray-300">
            Nyara, ngireng se messenah foto-foto pengasuh kita <span>di PP Darul Lughah Wal Karomah</span>
          </p>
        </div>
        <img
          src={hero}
          className="max-w-sm rounded-lg shadow-2xl w-48 sm:w-60 md:w-80 md:mt-28 md:mr-10 mb-4"
        />
      </div>
    </div>
  );
};

export default Hero;
