import React from "react";

const BorrowReqBooks = ({ reqBooks }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Book</th>
          <th>Status</th>
          <th>Requested date</th>
        </tr>
      </thead>

      <tbody>
        {reqBooks.map((curElem) => {
          return (
            <tr key={curElem._id}>
              <td>{curElem?.bookId?.bookName}</td>
              <td>{curElem?.status}</td>
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

export default BorrowReqBooks;
