import { Outlet, Navigate } from "react-router-dom";
import { BookState } from "../context/BookProvider";

const UserPrivateRoutes = () => {
  const { token, user } = BookState();
  // console.log(role);
  // console.log(token);
  return token && user.role === "user" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/signin" />
  );
};

export default UserPrivateRoutes;
