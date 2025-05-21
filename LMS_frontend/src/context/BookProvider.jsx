import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createContext } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
const BookContext = createContext();

export const API = `https://book-bolt.dev.geniussystems.com.np/api/v1`;
// export const API = `http://localhost:3000/api/v1`;

export const SUB_API = `https://book-bolt.dev.geniussystems.com.np/subscriber/v1`;
// export const SUB_API = `http://localhost:3000/subscriber/v1`;

export const ADMIN_API = `https://book-bolt.dev.geniussystems.com.np/admin/v1`;
// export const ADMIN_API = `http://localhost:3000/admin/v1`;

export const CLOUDI_API = `https://api.cloudinary.com/v1_1/dc73d4fcl/image/upload`;

const BookProvider = ({ children }) => {
  const navigateTo = useNavigate();
  // const [book, setBooks] = useState([]);
  const [token, setToken] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  const toast = useToast();

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  let first_url;
  const getUser = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      };
      const data = await axios.get(`${SUB_API}/users/profile`, config);

      if (data.status === 200) {
        setUser(data.data);
        setRole(data.data.role);
      }
    } catch (err) {
      if (
        (err?.response?.data?.code === 401 &&
          (err?.response?.data?.type === "UNAUTHENTICATED" ||
            err?.response?.data?.type === "INVALID_TOKEN")) ||
        (err?.response?.data?.name === "TypeError" &&
          err?.response?.data?.code === 400)
      ) {
        try {
          const data = await axios.post(`${API}/users/refresh-token`, {
            refreshToken: token.refreshToken,
          });
          if (data.status === 200) {
            setToken(data.data);
            localStorage.setItem("token", JSON.stringify(data.data));
            return;
          }
        } catch (err) {
          toast({
            title: "Session expired",
            // description: err?.response?.data?.data
            //   ? err?.response?.data?.data[0]?.message
            //   : err?.response?.data?.message,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          if (first_url === "admin") {
            navigateTo("/admin/signin");
          }
          navigateTo("/signin");
        }
      }
    }
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    setQuery("");

    if (token) {
      setToken(token);
      getUser(token);
    } else {
      const url = window.location.pathname;
      first_url = url.split("/")[1];
      setToken(null);
      setUser(null);

      if (first_url === "admin") {
        navigateTo("/admin/signin");
        return;
      }
    }
  }, [navigateTo]);

  return (
    <BookContext.Provider
      value={{
        token,
        setToken,
        isLoading,
        setIsLoading,
        getUser,
        user,
        setUser,
        toast,
        query,
        setQuery,
        role,
        setRole,
        currentPage,
        setCurrentPage,
        recordsPerPage,
        indexOfLastRecord,
        indexOfFirstRecord,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const BookState = () => {
  return useContext(BookContext);
};

export default BookProvider;
