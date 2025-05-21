import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="not_found_wrapper">
      <div className="not_found">
        <h1 className="large_h" style={{ color: "red" }}>
          OOPS !
        </h1>
        <div className="not_found_desc">
          <p className="normal_bold_p">404 - Error not found</p>
          <p>
            The page you are looking for might have been removed,
            <br /> had its name changed or temporary unavailable
          </p>
          <Link to="/">
            <p className="btn" style={{ width: "max-content" }}>
              Go to homepage
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
