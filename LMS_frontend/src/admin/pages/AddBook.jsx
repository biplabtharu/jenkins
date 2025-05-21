import React, { useEffect, useState } from "react";
import { Input, FormControl, FormLabel } from "@chakra-ui/react";
import {
  ADMIN_API,
  API,
  BookState,
  CLOUDI_API,
} from "../../context/BookProvider";
import spinner from "../../assets/spinner.svg";
import axios from "axios";

const AddBook = () => {
  const [bookName, setBookName] = useState();
  const [author, setAuthor] = useState();
  const [genre, setGenre] = useState();
  const [publisher, setPublisher] = useState();
  const [publicationDate, setPublicationDate] = useState();
  const [ISBN, setISBN] = useState();
  const [bookImg, setBookImg] = useState();
  const [loading, setLoading] = useState(false);
  const [openGenreBox, setOpenGenreBox] = useState(false);

  const [allGenre, setAllGenres] = useState([]);

  const { toast, token, setToken } = BookState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !bookName ||
      !author ||
      !genre ||
      !publisher ||
      !publicationDate ||
      !ISBN
    ) {
      alert("fill all the required fields");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      };

      const data = await axios.post(
        `${ADMIN_API}/books/`,
        { bookName, author, genre, publisher, publicationDate, ISBN, bookImg },
        config
      );

      if (data.status === 200) {
        toast({
          title: "Book added",
          status: "success",
          duration: 500,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
        setTimeout(() => {
          window.location.reload(true);
        }, 500);
        return;
      }

      // setLoading(false);
    } catch (err) {
      toast({
        title: "Adding book error",
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

  const postDetails = (pics) => {
    // console.log(pics);
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Upload image",
        description: "Please, upload an image",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "BookBolt");
      data.append("cloud_name", "dc73d4fcl");

      fetch(`${CLOUDI_API}`, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data.url.toString());
          // console.log(data);
          setBookImg(data.url.toString());
          setLoading(false);
        });

      // setLoading(false);
    } else {
      setLoading(false);
      toast({
        title: "Upload image",
        description: "Please, upload an image",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleGenre = async () => {
    try {
      const { data } = await axios.get(`${API}/books`);
      // console.log(data);
      const uniqueGenre = [...new Set(data.map((curElem) => curElem.genre))];
      setAllGenres(uniqueGenre);
    } catch (err) {
      // console.log(err);
      toast({
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

  const handleGenreAndInputBox = (e) => {
    const selectedValue = e.target.value;
    setGenre(selectedValue);

    if (selectedValue === "other") {
      setGenre("");
      setOpenGenreBox(true);
    } else {
      setOpenGenreBox(false);
    }
  };

  // console.log(allGenre);
  useEffect(() => {
    handleGenre();
  }, []);

  return (
    <div className="adm_add_book_wrapper">
      <div className="adm_add_book">
        <FormControl isRequired>
          <FormLabel>Book name</FormLabel>
          <Input
            placeholder="book name"
            name="bookName"
            onChange={(e) => setBookName(e.target.value)}
            value={bookName}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Author</FormLabel>
          <Input
            placeholder="author"
            name="author"
            onChange={(e) => setAuthor(e.target.value)}
            value={author}
          />
        </FormControl>

        <FormControl isRequired className="genre_form">
          <FormLabel>Genre</FormLabel>

          <select
            name="genre"
            id="genre"
            onChange={handleGenreAndInputBox}
            value={genre}
          >
            <option value="">Select genre</option>
            {allGenre.map((curElem, index) => {
              return (
                <option value={curElem} key={index}>
                  {curElem}
                </option>
              );
            })}
            <option value="other">Other</option>
          </select>

          {openGenreBox ? (
            <Input
              placeholder="genre"
              name="genre"
              onChange={(e) => setGenre(e.target.value)}
            />
          ) : (
            ""
          )}
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Publisher</FormLabel>
          <Input
            placeholder="publisher"
            name="publisher"
            onChange={(e) => setPublisher(e.target.value)}
            value={publisher}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Publication Date</FormLabel>
          <Input
            type="date"
            placeholder="publication date"
            name="publicationDate"
            onChange={(e) => setPublicationDate(e.target.value)}
            value={publicationDate}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>ISBN</FormLabel>
          <Input
            placeholder="ISBN"
            name="ISBN"
            onChange={(e) => setISBN(e.target.value)}
            value={ISBN}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Book image</FormLabel>
          <Input
            type="file"
            accept="/image/*"
            name="ISBN"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>

        {loading ? (
          <img className="spinner_small" src={spinner} />
        ) : (
          <button className="btn" onClick={handleSubmit}>
            Add Book
          </button>
        )}
      </div>
    </div>
  );
};

export default AddBook;
