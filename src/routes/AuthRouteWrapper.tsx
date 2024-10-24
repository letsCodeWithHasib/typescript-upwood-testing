import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, ReactNode, FC } from "react";
import { RootState } from "../redux/store";

interface AuthRouteWrapperProps {
  children: ReactNode; // This allows any valid React child components
}

const AuthRouteWrapper: FC<AuthRouteWrapperProps> = ({ children }) => {
  const navigate = useNavigate();
  const { authStatus } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (authStatus === "SignedIn") {
      navigate("/user");
    }
  }, [authStatus]);

  return <>{children}</>;
};

export default AuthRouteWrapper;
