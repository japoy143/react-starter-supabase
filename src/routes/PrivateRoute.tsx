import { type PropsWithChildren } from "react";
import { userAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

type PrivateRoutePropsType = PropsWithChildren;
const PrivateRoute = ({ children }: PrivateRoutePropsType) => {
  const { session } = userAuth();

  if (session === undefined) {
    return <p>Loading ...</p>;
  }

  return <>{session ? <>{children} </> : <Navigate to={"/auth/signup"} />}</>;
};

export default PrivateRoute;
