import React from "react";
import { NavLink, Navigate } from "react-router-dom";
import { BookState } from "../../context/BookProvider";
import profile from "../../assets/profile.png";

const AdminNavbar = () => {
  const { user, token, role } = BookState();

  return (
    <div className="adm_navbar_wrapper">
      <div className="adm_navbar">
        <h1 className="small_h">BookBolt</h1>
        <div className="adm_navlists nav_p">
          <NavLink
            activeClassName="active"
            className="inactive"
            to="/admin/dashboard"
          >
            <p>Home</p>
          </NavLink>
          <NavLink
            activeClassName="active"
            className="inactive"
            to="/admin/books"
          >
            <p>Books</p>
          </NavLink>
          <NavLink
            activeClassName="active"
            className="inactive"
            to="/admin/users"
          >
            <p>Users</p>
          </NavLink>
          <NavLink
            activeClassName="active"
            className="inactive"
            to="/admin/inventories"
          >
            <p>Inventories</p>
          </NavLink>
          <NavLink
            activeClassName="active"
            className="inactive"
            to="/admin/borrows"
          >
            <p>Borrows</p>
          </NavLink>
          <NavLink
            activeClassName="active"
            className="inactive"
            to="/admin/returns"
          >
            <p>Returns</p>
          </NavLink>
          <NavLink
            activeClassName="active"
            className="inactive"
            to="/admin/borrow-requests"
          >
            <p>Borrow-requests</p>
          </NavLink>
          <NavLink
            activeClassName="active"
            className="inactive"
            to="/admin/return-requests"
          >
            <p>Return-requests</p>
          </NavLink>
          <NavLink
            activeClassName="active"
            className="inactive"
            to="/admin/config"
          >
            <p>Config</p>
          </NavLink>
        </div>
        <div className="adm_profile">
          <NavLink
            activeClassName="active"
            className="inactive"
            to="/admin/profile"
          >
            <img
              className="small_img"
              src={user?.userImg ? user.userImg : profile}
            />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
