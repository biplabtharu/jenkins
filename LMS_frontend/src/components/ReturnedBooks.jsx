import React from "react";

const ReturnedBooks = ({ returnedBooks, showRb }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Book</th>
          <th>Status</th>
          <th>Returned date</th>
        </tr>
      </thead>

      <tbody>
        {returnedBooks.map((curElem) => {
          return (
            <tr key={curElem._id}>
              <td>{curElem?.book?.bookName}</td>
              <td>{curElem?.status ? "Returned" : ""}</td>
              <td>
                {new Date(curElem.createdAt)
                  .toISOString()
                  .slice(0, 10)
                  .replace(/-/g, "/")}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ReturnedBooks;
