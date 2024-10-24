// Importing necessary assets and components for routing and styling
import logoutImage from "../../../assets/logout.png";
import { sidebarItems } from "../../assets/data";
import { Link, useMatch, useLocation } from "react-router-dom"; // Importing routing components
import { style } from "../../assets/style"; // Importing custom styles
import React, { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { signOut } from "../../redux/features/authSlice";

// Define the Sidebar component props interface
interface SidebarComponentProps {
  showSideBar: boolean;
  setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarComponentProps> = ({
  showSideBar,
  setShowSideBar,
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Type the route parameter as a string
  const contains = (route: string): boolean => {
    return location.pathname.includes(route);
  };

  useEffect(() => {
    setShowSideBar(false);
  }, [location, setShowSideBar]);

  return (
    // Sidebar container with fixed positioning and custom width
    <aside
      className={`md:w-[250px] fixed px-5 md:top-[100px] ${
        showSideBar ? "block" : "hidden"
      } md:block md:z-0 rounded-t-lg items-start h-screen top-0 flex flex-col bg-white z-40 md:justify-between w-full justify-center md:ml-5`}
    >
      {/* Navigation container with vertical layout and spacing */}
      <nav className="flex justify-center items-center">
        <div className="flex flex-col gap-1">
          {/* Link to Active Projects */}
          {sidebarItems.map((sidebarItem, index) => {
            const { title, white, normal, path } = sidebarItem;
            const isActive = useMatch("user");

            return (
              <Link key={index} to={path} className="flex items-center">
                <button
                  className={`${style.sideLink} ${
                    (contains(path) ||
                      (isActive && title === "Active Project")) &&
                    style.sideLinkSelected
                  }`}
                >
                  <img
                    className="w-[22px]"
                    src={
                      contains(path) || (isActive && title === "Active Project")
                        ? white
                        : normal
                    }
                    alt={title}
                  />
                  {title}
                </button>
              </Link>
            );
          })}
          {/* Logout button with responsiveness */}
          <button
            className={`${style.sideLink} md:hidden flex items-center gap-2`}
            onClick={() => dispatch(signOut())}
          >
            <img
              className="w-[20px] h-[20px]"
              src={logoutImage}
              alt="Logout Icon"
            />
            <span className="font-[Roboto] text-xs font-bold uppercase text-[#6B6B6B]">
              Logout
            </span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
