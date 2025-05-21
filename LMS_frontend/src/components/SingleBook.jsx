import React from "react";
import default_book from "../assets/bookCover.jpg";
import { Link } from "react-router-dom";

const SingleBook = ({ books }) => {
  return (
    <div className="books_wrapper">
      <div className="books">
        {books.map((curElem) => {
          return (
            <Link to={"/books/" + curElem._id} key={curElem._id}>
              <div className="book_detail">
                <div className="book_desc">
                  {curElem.bookName.length < 19 ? (
                    <p
                      className="bold_p"
                      style={{
                        textTransform: "capitalize",
                        textAlign: "center",
                      }}
                    >
                      {curElem.bookName}
                    </p>
                  ) : (
                    <p
                      className="bold_p"
                      style={{
                        textTransform: "capitalize",
                        textAlign: "center",
                      }}
                    >
                      {curElem.bookName.slice(0, 17)}...
                    </p>
                  )}
                  {/* {curElem.author.length < 10 ? (
                  <p className="small_bold_p">{curElem.author}</p>
                ) : (
                  <p className="small_bold_p">
                    {curElem.author.slice(0, 10)}...
                  </p>
                )} */}
                </div>
                <img
                  src={curElem.bookImg ? curElem.bookImg : default_book}
                  className="book_cover_img"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SingleBook;
