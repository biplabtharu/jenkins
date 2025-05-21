import React from "react";
import { BookState } from "../../context/BookProvider";
import { useNavigate } from "react-router-dom";
import profile from "../../assets/profile.png";
const AdminProfile = () => {
  const { token, setToken, user, getUser, toast } = BookState();
  const navigateTo = useNavigate();
  const handleSignOut = () => {
    const shouldSignout = window.confirm("Are you sure want to sign out?");
    if (shouldSignout) {
      localStorage.removeItem("token");
      setToken(null);
      toast({
        title: "Sign out successfull",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigateTo("/admin/signin");
    }
  };
  return (
    <div className="user_page_wrapper">
      <div className="user_page">
        <div className="user_profile">
          <div className="user_img">
            <img
              className="profile_pic"
              src={user?.userImg ? user?.userImg : profile}
              alt="profile pic"
            />
          </div>
          <div className="user_details">
            <p className="small_h">
              {user ? user.firstName : ""} {user ? user.lastName : ""}
            </p>
            <p>{user ? user.email : ""}</p>
            <div style={{ marginTop: "20px" }}>
              <p
                className="second_btn"
                onClick={handleSignOut}
                style={{
                  cursor: "pointer",
                  color: "red",
                  width: "max-content",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontWeight: "500",
                }}
              >
                Sign out
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
