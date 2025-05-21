import React from "react";

const About = () => {
  return (
    <div className="about">
      <div className="about_wrapper">
        <div className="about_header about_div">
          <h3 className="title_h">FEATURES</h3>
          <div>
            <h1 className="large_h">
              An Excellent Book{" "}
              <span className="large_h col_red">Provider</span>
            </h1>
            {/* <h1 className="large_h col_red"> Provider</h1> */}
          </div>
          <p className="normal_bold_p about_p">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </p>
          <div className="features_list">
            <div>
              <div>24/7 Support</div>
              <div>Reliable</div>
              <div>Secure</div>
            </div>
            <div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
