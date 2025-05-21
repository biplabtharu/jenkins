import React, { useEffect, useState } from "react";
import axios from "axios";
import { BookState } from "../context/BookProvider";
import SingleBook from "../components/SingleBook";
import { API } from "../context/BookProvider";
import spinner from "../assets/spinner.svg";
import Search from "../components/Search";
import Pagination from "../components/Pagination";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    query,
    setQuery,
    toast,
    currentPage,
    setCurrentPage,
    recordsPerPage,
    indexOfLastRecord,
    indexOfFirstRecord,
  } = BookState();

  const getBooks = async (req, res) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      // let data;
      if (query) {
        const { data } = await axios.get(`${API}/books?query=${query}`, config);
        setBooks(data);
        setIsLoading(false);
        return;
      }
      const { data } = await axios.get(`${API}/books`, config);
      setBooks(data);
      setIsLoading(false);
    } catch (err) {
      toast({
        title: "Books not found",
        description: err?.response?.data?.data
          ? err?.response?.data?.data[0]?.message
          : err?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setIsLoading(false);
    }
  };

  const currentRecords = books.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(books.length / recordsPerPage);

  useEffect(() => {
    setIsLoading(true);
    let timerOut = setTimeout(() => {
      getBooks();
    }, 700);

    return () => clearTimeout(timerOut);
  }, [query]);

  return (
    <>
      <Search getBooks={getBooks} books={books} setBooks={setBooks} />
      {isLoading === true ? (
        <img src={spinner} className="spinner" style={{ marginTop: "50px" }} />
      ) : books.length >= 1 ? (
        <div>
          <SingleBook books={currentRecords} />
          <Pagination
            nPages={nPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      ) : (
        <p
          className="normal_bold_p"
          style={{ margin: "20px", textAlign: "center" }}
        >
          No books found
        </p>
      )}
    </>
  );
};

export default Books;
