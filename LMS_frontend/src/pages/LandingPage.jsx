import React from "react";
import Lottie from "react-lottie";
import landing_img from "../assets/homeAnimation.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: landing_img,
  renderer: "svg",
};

const LandingPage = () => {
  return (
    <div className="landing_page">
      <div className="landing_page_wrapper">
        <div className="landing_header landing_div">
          <h3 className="title_h">CHOOSE YOUR BOOK!</h3>
          <div>
            <h1 className="large_h">Meet Your Favourite</h1>
            <h1 className="large_h col_red"> Authors</h1>
          </div>
          <p className="normal_p">
            BookBolt is an advanced library management system designed to
            revolutionize the way libraries organize, manage, and provide access
            to their collections. With its intuitive interface, robust features,
            and seamless integration capabilities, BookVerse caters to the
            evolving needs of libraries in the digital age.
          </p>
        </div>
        <div className="landing_img landing_div">
          <Lottie
            options={defaultOptions}
            height={500}
            width={500}
            className="lottie"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
