import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BookState } from "../../context/BookProvider";
import spinner from "../../assets/spinner.svg";
import { API } from "../../context/BookProvider";

export default function AdminSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const { user, getUser, toast } = BookState();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Plz all the required fields");
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
        `${API}/users/admin-signin`,
        { email, password },
        config
      );

      if (data.status === 200) {
        toast({
          title: "Signin successfull",
          status: "success",
          duration: 1000,
          isClosable: true,
          position: "top",
        });

        // const accessToken = data.headers.get("X-accessToken");
        // const refreshToken = data.headers.get("X-refreshToken");
        // const email = data.headers.get("X-email");

        localStorage.setItem("token", JSON.stringify(data.data));
        navigateTo("/admin/dashboard");
        setLoading(false);

        return;
      }
    } catch (err) {
      setLoading(false);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);
      toast({
        title: "Signin error",
        description: err?.response?.data?.data
          ? err?.response?.data?.data[0]?.message
          : err?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <div className="form">
      <form>
        <h3>Admin signin</h3>

        <div className="email">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Your email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="password">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Your password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {loading ? (
          <img className="spinner_small" src={spinner} />
        ) : (
          <button
            disabled={isButtonDisabled}
            className="btn"
            onClick={handleSubmit}
          >
            Signin
          </button>
        )}
      </form>
    </div>
  );
}
