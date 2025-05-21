import React from "react";
import { Link } from "react-router-dom";

const DiscoverBooks = () => {
  return (
    <div className="discover_books">
      <h1 className="title_h">Hey !</h1>
      <h1 className="large_h">
        Discover Your Next <span className="col_red">Book</span>
      </h1>

      <div className="book_selection nav_p normal_bold_p">
        <p>New Releases</p>
        <p>Best Sellers</p>
      </div>
      <div className="book_detail_wrapper">
        <div className="book_detail">
          <Link>
            <img src={bookCover} className="book_cover"></img>
            <p className="small_h">My soul</p>
            <p className="small_bold_p">Biplab Tharu</p>
          </Link>
        </div>

        <div className="book_detail">
          <img src={bookCover2} className="book_cover"></img>
          <p className="small_h">Intelligent Investor</p>
          <p className="small_bold_p">Warren Buffet</p>
        </div>

        <div className="book_detail">
          <img src={bookCover} className="book_cover"></img>
          <p className="small_h">Intelligent Investor</p>
          <p className="small_bold_p">Warren Buffet</p>
        </div>

        <div className="book_detail">
          <img src={bookCover2} className="book_cover"></img>
          <p className="small_h">Intelligent Investor</p>
          <p className="small_bold_p">Warren Buffet</p>
        </div>

        <div className="book_detail">
          <img src={bookCover} className="book_cover"></img>
          <p className="small_h">Intelligent Investor</p>
          <p className="small_bold_p">Warren Buffet</p>
        </div>
      </div>

      <Link className="btn">Discover More Books</Link>
    </div>
  );
};

export default DiscoverBooks;
