import React from "react";
import { NavLink } from "react-router-dom";
import { BookState } from "../context/BookProvider";
import profile from "../assets/profile.png";

const Navbar = () => {
  const { token, user, setToken, getUser, setUser, role, toast } = BookState();

  return (
    <>
      <div className="navbar">
        <NavLink activeClassName="active" className="inactive" to="/">
          <h1 className="small_h">BookBolt</h1>
        </NavLink>
        <div className="navbar_div">
          <div className="nav_lists nav_p">
            <NavLink activeClassName="active" className="inactive" to="/">
              Home
            </NavLink>
            <NavLink activeClassName="active" className="inactive" to="/books">
              Books
            </NavLink>
          </div>

          <div className="create_acc nav_p">
            {!token && !user ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <NavLink
                  activeClassName="active"
                  className="inactive"
                  to="/signin"
                >
                  Sign in
                </NavLink>
                <NavLink className="btn" to="/signup" style={{ color: "#fff" }}>
                  Sign up
                </NavLink>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "30px",
                  padding: "5px",
                  borderRadius: "10px",
                }}
              >
                <NavLink
                  activeClassName="active"
                  className="inactive"
                  to={"/users/" + user?._id}
                >
                  <img
                    className="small_img"
                    src={user?.userImg ? user.userImg : profile}
                    alt="profile pic"
                  />
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
