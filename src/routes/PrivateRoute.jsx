// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const PrivateRoute = ({ children }) => {
//   const isAuth = useSelector((state) => state.auth.isAuthenticated);
//   return isAuth ? children : <Navigate to="/admin/login" replace />;
// };

// export default PrivateRoute;

import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  return isLoggedIn ? children : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
