import React, { useEffect, useState } from "react";
import axios from "axios";
import { SUB_API } from "../context/BookProvider";
import { BookState } from "../context/BookProvider";
import spinner from "../assets/spinner.svg";

const BorrowedBooks = ({ borrowedBooks, show, setBorrowedBooks }) => {
  const { token, toast } = BookState();
  const [loading, setLoading] = useState(false);
  const [returnOrderPlaced, setReturnOrderPlaced] = useState(false);
  // const [returnOrderRejected, setReturnOrderRejected] = useState(false);

  const handleReturn = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    };
    try {
      setLoading(true);
      const shouldReturn = window.confirm(
        "Are you sure want to return this book?"
      );
      if (shouldReturn) {
        const data = await axios.post(
          `${SUB_API}/returns`,
          { bookId: id },
          config
        );

        if (data.status === 200) {
          toast({
            title: data.data.message,
            status: "success",
            duration: 600,
            isClosable: true,
            position: "top",
          });
          setTimeout(() => {
            window.location.reload(true);
          }, 600);

          setLoading(false);
        }
      }
    } catch (err) {
      toast({
        title: "Return error",
        description: err?.response?.data?.data
          ? err?.response?.data?.data[0]?.message
          : err?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Book</th>
          <th>Status</th>
          <th>Genre</th>
          <th>Borrowed date</th>
          <th>Due date</th>
          <th>Order status</th>
          <th>Action</th>
        </tr>
      </thead>
      {borrowedBooks.map((curElem) => {
        return (
          <tbody key={curElem._id}>
            <tr>
              <td>{curElem?.book?.bookName}</td>
              <td>{curElem?.status ? "Not returned" : "Returned"}</td>
              <td>{curElem?.book?.genre}</td>
              <td>
                {new Date(curElem.createdAt)
                  .toISOString()
                  .slice(0, 10)
                  .replace(/-/g, "/")}
              </td>
              <td>
                {curElem.dueDate
                  ? new Date(curElem?.dueDate)
                      .toISOString()
                      .slice(0, 10)
                      .replace(/-/g, "/")
                  : ""}
              </td>
              <td>{curElem?.returnOrder}</td>
              <td>
                {curElem?.returnOrder === "not_placed" ||
                curElem?.returnOrder === "rejected" ? (
                  <p
                    className="third_btn"
                    onClick={() => handleReturn(curElem.book._id)}
                  >
                    Return
                  </p>
                ) : curElem?.returnOrder === "accepted" ? (
                  ""
                ) : (
                  <p>order placed</p>
                )}
              </td>
            </tr>
          </tbody>
        );
      })}
    </table>
  );
};

export default BorrowedBooks;
