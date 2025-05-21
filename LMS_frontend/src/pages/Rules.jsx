import React from "react";

const Rules = () => {
  return (
    <div className="rules">
      <div className="rules_wrapper">
        <h1 className="medium_h">Rules</h1>
        <div className="all_rules">
          <div className="rules_heading">
            <p className="rules_h1">Register Before Borrow</p>
            <p className="small_p">
              User should have to register first before borrowing any book. An
              unregistered user can't borrow book, but can explore all the
              books.
            </p>
          </div>
          <div className="rules_heading">
            <p className="rules_h1">Borrow Request First</p>
            <p className="small_p">
              First of all, user should send borrow request. After the admin
              accepted borrow request, user can borrow the book.
            </p>
          </div>

          <div className="rules_heading">
            <p className="rules_h1">Return Request First</p>
            <p className="small_p">
              First of all, user should send return request. After the admin
              accepted return request, user can return the book.
            </p>
          </div>
          <div className="rules_heading">
            <p className="rules_h1">Borrowing Limits</p>
            <p className="small_p">
              Users are limited to borrowing a certain number of books at a
              time. The limit currently is <span>2</span>. It will keep
              changing.
            </p>
          </div>
          <div className="rules_heading">
            <p className="rules_h1">Loan Period</p>
            <p className="small_p">
              Each borrowed book has a specified loan period, after which it
              must be returned. Users are responsible for adhering to loan
              periods to avoid fines or penalties.
            </p>
          </div>

          <div className="rules_heading">
            <p className="rules_h1">Late Returns and Fines</p>
            <p className="small_p">
              Users are responsible for returning borrowed books on time. Fines
              may be imposed for late returns, calculated based on the duration
              of the delay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
