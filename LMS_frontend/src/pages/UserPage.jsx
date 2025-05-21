import React, { useEffect, useState } from "react";
import axios from "axios";
import { SUB_API } from "../context/BookProvider";
import { BookState } from "../context/BookProvider";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";
import BorrowedBooks from "../components/BorrowedBooks";
import ReturnedBooks from "../components/ReturnedBooks";
import spinner from "../assets/spinner.svg";
import BorrowReqBooks from "../components/BorrowReqBooks";
import Pagination from "../components/Pagination";

const UserPage = () => {
  const {
    token,
    setToken,
    user,
    toast,
    currentPage,
    setCurrentPage,
    recordsPerPage,
    indexOfLastRecord,
    indexOfFirstRecord,
  } = BookState();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reqBooks, setReqBooks] = useState([]);
  const [show, setShow] = useState(false);
  const [showRb, setShowRb] = useState(false);
  const [showBrb, setShowBrb] = useState(false);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // const [currentBBooks, setCurrentBBooks] = useState([]);
  // const [btnLoading, setBtnLoading] = useState(false);
  const [fine, setFine] = useState();

  const navigateTo = useNavigate();

  // let nPages;
  const handleBorrowedBooks = async () => {
    if (!token) {
      navigateTo("/signin");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    };
    try {
      setLoading(true);
      const data = await axios.get(`${SUB_API}/borrows`, config);
      setBorrowedBooks(data.data);
      // console.log(data.data);

      // const currentRecords = data.data.slice(
      //   indexOfFirstRecord,
      //   indexOfLastRecord
      // );
      // console.log(currentRecords);
      // setBorrowedBooks(currentRecords);
      // nPages = Math.ceil(currentRecords.length / recordsPerPage);

      setShow(!false);
      setLoading(false);

      // setTimeout(() => {
      //   setIsButtonDisabled(false);
      // }, 4000);
      return;
    } catch (err) {
      setIsButtonDisabled(true);
      toast({
        title: "Error",
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
      }, 4000);
    }
  };
  // console.log(currentBBooks);

  const handleReturnedBooks = async () => {
    if (!token) {
      navigateTo("/signin");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    };
    try {
      setLoading(true);
      const data = await axios.get(`${SUB_API}/returns`, config);
      //   return;
      setReturnedBooks(data.data);
      setShowRb(!false);
      setLoading(false);
      // setTimeout(() => {
      //   setIsButtonDisabled(false);
      // }, 4000);
      return;
    } catch (err) {
      setIsButtonDisabled(true);
      toast({
        title: "Error",
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
      }, 4000);
    }
  };

  const handleBorrowRequest = async () => {
    if (!token) {
      navigateTo("/signin");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    };
    try {
      setLoading(true);
      const data = await axios.get(`${SUB_API}/borrow-requests/`, config);
      setReqBooks(data.data);
      setShowBrb(!false);
      setLoading(false);

      // setTimeout(() => {
      //   setIsButtonDisabled(false);
      // }, 4000);
      return;
    } catch (err) {
      setIsButtonDisabled(true);
      toast({
        title: "Error",
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
      }, 4000);
    }
  };

  const getFine = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    };
    const fineData = await axios.get(`${SUB_API}/fines`, config);
    setFine(fineData.data);
  };

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
      navigateTo("/signin");
    }
  };

  useEffect(() => {
    if (token) {
      getFine();
    }
  });
  return (
    <div className="user_page_wrapper">
      <div className="user_page">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
          <div className="fine_amount">
            <p className="normal_bold_p">
              Toal Fine : <span>Rs {fine}</span>
            </p>
          </div>
        </div>

        <div className="book_history">
          {loading ? (
            <img
              className="spinner_small"
              style={{
                margin: "auto",
              }}
              src={spinner}
            />
          ) : showBrb ? (
            <div>
              <p
                className="normal_bold_p"
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  textDecoration: "underline",
                }}
              >
                Requested Books
              </p>
              {reqBooks.length >= 1 ? (
                <BorrowReqBooks reqBooks={reqBooks} show={showBrb} />
              ) : (
                <p className="small_h" style={{ textAlign: "center" }}>
                  No books requested
                </p>
              )}

              <p
                className="third_btn"
                style={{
                  width: "max-content",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
                onClick={() => setShowBrb(false)}
              >
                Hide
              </p>
            </div>
          ) : (
            <button
              className="borrowed_books second_btn"
              onClick={handleBorrowRequest}
              disabled={isButtonDisabled}
            >
              Requested Books
            </button>
          )}
          {show ? (
            <div>
              <p
                className="normal_bold_p"
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  textDecoration: "underline",
                }}
              >
                Borrowed Books
              </p>
              {borrowedBooks.length >= 1 ? (
                <div>
                  <BorrowedBooks
                    borrowedBooks={borrowedBooks}
                    setBorrowedBooks={setBorrowedBooks}
                    show={show}
                  />
                  {/* <Pagination
                    nPages={nPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  /> */}
                </div>
              ) : (
                <p className="small_h" style={{ textAlign: "center" }}>
                  No books found
                </p>
              )}

              <p
                className="third_btn"
                style={{
                  width: "max-content",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
                onClick={() => setShow(false)}
              >
                Hide
              </p>
            </div>
          ) : (
            <button
              className="borrowed_books second_btn"
              onClick={handleBorrowedBooks}
              disabled={isButtonDisabled}
            >
              Borrowed Books
            </button>
          )}
          {showRb ? (
            <div>
              <p
                className="normal_bold_p"
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  textDecoration: "underline",
                }}
              >
                Returned Books
              </p>
              {returnedBooks.length >= 1 ? (
                <ReturnedBooks returnedBooks={returnedBooks} showRb={showRb} />
              ) : (
                <p className="small_h" style={{ textAlign: "center" }}>
                  No books found
                </p>
              )}
              <p
                className="third_btn"
                style={{
                  width: "max-content",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
                onClick={() => setShowRb(false)}
              >
                Hide
              </p>
            </div>
          ) : (
            <button
              className="borrowed_books second_btn"
              onClick={handleReturnedBooks}
              disabled={isButtonDisabled}
            >
              Returned Books
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
