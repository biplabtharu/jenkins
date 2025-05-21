import React, { useState, useEffect } from "react";
import { ADMIN_API, BookState } from "../../context/BookProvider";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigateTo = useNavigate();
  const { token, setToken } = BookState();

  useEffect(() => {
    if (!token) {
      setToken(null);
      navigateTo("/admin/signin");
    }
  }, []);
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <h1 className="medium_h">This is admin page</h1>
    </div>
  );
};

export default AdminDashboard;
