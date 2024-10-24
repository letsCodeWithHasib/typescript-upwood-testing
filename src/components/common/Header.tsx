import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch } from "../../hooks";
import { signOut } from "../../redux/features/authSlice";
import profile from "../../../assets/profile.png";
import logo from "../../../assets/logo.png";
import logoutImage from "../../../assets/logout.png";
import menu from "../../../assets/menu-right.png";
import close from "../../../assets/close.png";
import { useNavigate } from "react-router-dom";

// Define the props interface for the Header component
interface HeaderProps {
  showSideBar: boolean;
  setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ showSideBar, setShowSideBar }) => {
  const user = useSelector(
    (state: { user: { firstName: string; lastName: string } }) => state.user
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const lastScrollY = useRef<number>(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      return () => {
        URL.revokeObjectURL(selectedImage);
      };
    }
  }, [selectedImage]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= lastScrollY.current);
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(signOut());
    navigate("/auth");
  };

  return (
    <header
      className={`flex z-10 bg-white justify-between items-center lg:px-10 px-5 fixed w-full top-0 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Logo section */}
      <section className="logo">
        <img className="w-[120px]" src={logo} alt="Company Logo" />
      </section>

      {/* User profile and logout button section */}
      <section className="gap-10 hidden md:flex">
        <button className="items-center gap-5 hidden md:flex">
          <label htmlFor="fileInput">
            <img
              className={`${
                selectedImage
                  ? "h-[30px] w-[30px] shadow-custom"
                  : "h-[50px] w-[50px]"
              } rounded-full cursor-pointer`}
              src={selectedImage || profile}
              alt="Profile"
            />
          </label>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <span className="font-[Roboto] text-xs font-bold uppercase text-[#6B6B6B] -ml-3">
            {user?.firstName} {user?.lastName}
          </span>
        </button>

        <button className="flex items-center gap-2" onClick={handleLogout}>
          <span className="font-[Roboto] text-xs font-bold uppercase text-[#6B6B6B] -ml-3">
            logout
          </span>
          <img
            className="w-[20px] h-[20px]"
            src={logoutImage}
            alt="Logout Icon"
          />
        </button>
      </section>

      <div className="md:hidden">
        <button
          onClick={() => setShowSideBar(!showSideBar)}
          className="p-2 w-[40px] rounded-full bg-green-300"
        >
          <img className="w-6" src={showSideBar ? close : menu} alt="" />
        </button>
      </div>
    </header>
  );
};

export default Header;
