import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../context/BookProvider";
import { SUB_API } from "../context/BookProvider";
import { BookState } from "../context/BookProvider";
import spinner from "../assets/spinner.svg";
import { useNavigate } from "react-router-dom";
import default_book from "../assets/bookCover.jpg";
import NotFoundPage from "./NotFoundPage";

const BookDetail = () => {
  let { id } = useParams();
  const [book, setBook] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { token, setToken, toast } = BookState();
  const [status, setStatus] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const navigateTo = useNavigate();

  const getBook = async (req, res) => {
    try {
      setIsLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        setToken("");
      }
      setToken(token);

      const { data } = await axios.get(`${API}/books/${id}`);
      if (data.status === false) {
        setStatus(false);
      }
      setBook(data);
      if (!token) {
        setStatus(false);
      }
      setIsLoading(false);
    } catch (err) {
      toast({
        title: "Book not found",
        description: err?.response?.data?.data
          ? err?.response?.data?.data[0]?.message
          : err?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoading(false);
      setError(true);
    }
  };

  const handleBorrow = async (id) => {
    const accessToken = token.accessToken;
    try {
      const shouldBorrow = window.confirm(
        "Are you sure want to borrow this book?"
      );
      if (shouldBorrow) {
        setIsButtonDisabled(true);
        setBtnLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const data = await axios.post(
          `${SUB_API}/borrows`,
          { bookId: id },
          config
        );

        if (data.status === 200) {
          toast({
            title: data.data.message,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
          setBtnLoading(false);
          setTimeout(() => {
            setIsButtonDisabled(false);
          }, 3000);
          return;
        }
        return;
      }
    } catch (err) {
      toast({
        title: "Borrow error",
        description: err?.response?.data?.data
          ? err?.response?.data?.data[0]?.message
          : err?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setBtnLoading(false);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);
    }
  };

  useEffect(() => {
    getBook();
  }, []);

  return error ? (
    <NotFoundPage />
  ) : (
    <div className="single_book_wrapper">
      {loading ? (
        <img className="spinner" src={spinner} />
      ) : (
        <div className="single_book">
          <div>
            <img
              src={book.bookImg ? book.bookImg : default_book}
              className="book_cover"
            ></img>
          </div>
          <div className="single_book_detail">
            <p className="large_p">
              <span>Book: </span>
              {book.bookName}
            </p>
            <p className="medium_p">
              <span>author: </span> {book.author}
            </p>
            <p className="medium_p">
              <span>genre: </span>
              {book.genre}
            </p>
            <p className="medium_p">
              <span>publisher: </span>
              {book.publisher}
            </p>
            <p className="medium_p">
              <span>publicationDate: </span>
              {book.publicationDate}
            </p>
            <p className="medium_p">
              <span>ISBN: </span>
              {book.ISBN}
            </p>
            <p className="medium_p">
              <span>Status: </span>
              {book.status === true ? (
                "Available"
              ) : (
                <span
                  className="medium_p"
                  style={{ color: "red", fontWeight: "600" }}
                >
                  Not Available
                </span>
              )}
            </p>

            {status === true && token && book.status === true ? (
              btnLoading ? (
                <img
                  style={{
                    width: "40px",
                  }}
                  src={spinner}
                />
              ) : (
                <button
                  className="btn"
                  style={{
                    border: "none",
                    width: "max-content",
                    cursor: "pointer",
                  }}
                  disabled={isButtonDisabled}
                  onClick={() => handleBorrow(book._id)}
                >
                  <p>Borrow</p>
                </button>
              )
            ) : (
              <button className="disabled_btn">Borrow</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
