import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import spinner from "../assets/spinner.svg";
import { API, CLOUDI_API } from "../context/BookProvider";
import { BookState } from "../context/BookProvider";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userImg, setUserImg] = useState();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  ``;
  const { getUser, toast } = BookState();

  const navigateTo = useNavigate();

  const postDetails = (pics) => {
    // console.log(pics);
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Upload image",
        description: "Please, upload an image",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "BookBolt");
      data.append("cloud_name", "dc73d4fcl");

      fetch(`${CLOUDI_API}`, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUserImg(data.url.toString());
          setLoading(false);
        });

      // setLoading(false);
    } else {
      setLoading(false);
      toast({
        title: "Upload image",
        description: "Please, upload an image",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      alert("fill all the required fields");
      return;
    }
    try {
      setLoading(true);
      setIsButtonDisabled(true);

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const data = await axios.post(
        `${API}/users/signup`,
        { firstName, lastName, email, password, userImg },
        config
      );

      if (data.status === 201) {
        toast({
          title: "Signup successfull",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        localStorage.setItem("token", JSON.stringify(data.data));
        navigateTo("/");
        setLoading(false);
        return;
      }

      // setLoading(false);
    } catch (err) {
      toast({
        title: "Signup error",
        description: err?.response?.data?.data
          ? err?.response?.data?.data[0]?.message
          : err?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);
    }
  };

  return (
    <div className="form">
      <form method="POST">
        <h3>Signup</h3>
        <div className="fname">
          <label>First name:</label>
          <input
            type="text"
            placeholder="Your first name"
            name="firstName"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
        </div>

        <div className="lname">
          <label>Last name:</label>
          <input
            type="text"
            placeholder="Your last name"
            name="lastName"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
        </div>

        <div className="email">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Your email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="password">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Your password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div id="pic">
          <label>Profile pic:</label>
          <input
            type="file"
            accept="/image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </div>

        {loading ? (
          <img className="spinner_small" src={spinner} />
        ) : (
          <button
            className="btn"
            disabled={isButtonDisabled}
            onClick={handleSubmit}
          >
            Signup
          </button>
        )}
      </form>
    </div>
  );
}
