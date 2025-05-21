import React from "react";
import { FormControl, Input } from "@chakra-ui/react";
import { BookState } from "../context/BookProvider";

const Search = () => {
  const { query, setQuery } = BookState();
  return (
    <>
      <div className="search_wrapper">
        <div className="search">
          <FormControl>
            <Input
              type="text"
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
            />
          </FormControl>
        </div>
      </div>
    </>
  );
};

export default Search;
