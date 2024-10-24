import preview from "../assets/preview.png";
import { Outlet } from "react-router-dom";

const Protected = () => {
  return (
    <main className="bg-[#F8FBF8] min-h-screen p-[1px]">
      {/* Main container for the login pagh-sreene */}
      <div className="flex mt-[70px] px-[100px] flex-wrap justify-center xl:justify-between ">
        {/* Left preview section with an image */}
        <div className="w-[692px] xl:block hidden">
          <img className="w-full" src={preview} alt="Preview" />
        </div>

        {/* Right form-container for login and invitation request */}
        <Outlet />
      </div>
    </main>
  );
};

export default Protected;
