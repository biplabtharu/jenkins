import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ADMIN_API,
  API,
  BookState,
  CLOUDI_API,
} from "../../context/BookProvider";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import spinner from "../../assets/spinner.svg";

import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";

const AdminBooks = () => {
  const {
    token,
    toast,
    currentPage,
    setCurrentPage,
    recordsPerPage,
    indexOfLastRecord,
    indexOfFirstRecord,
  } = BookState();
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const [bookName, setBookName] = useState();
  const [author, setAuthor] = useState();
  const [genre, setGenre] = useState();
  const [status, setStatus] = useState();
  const [publisher, setPublisher] = useState();
  const [publicationDate, setPublicationDate] = useState();
  const [ISBN, setISBN] = useState();
  const [bookImg, setBookImg] = useState();
  const [loading, setLoading] = useState(false);

  const getBooks = async () => {
    const data = await axios.get(`${API}/books`);
    setBooks(data.data);
  };

  const handleOpenModal = (curElem) => {
    setCurrentBook(curElem);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const shouldDelete = window.confirm("Are you sure want to delete?");
      if (shouldDelete) {
        const config = {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        };
        const data = await axios.delete(`${ADMIN_API}/books/${id}`, config);
        if (data.status === 200) {
          setTimeout(() => {
            window.location.reload(true);
          }, 500);

          toast({
            title: "Book deleted successfully",
            status: "success",
            duration: 500,
            isClosable: true,
            position: "top",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Deleting book error",
        description: err?.response?.data?.data
          ? err?.response?.data?.data[0]?.message
          : err?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const postDetails = (pics) => {
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
          setBookImg(data.url.toString());
          setLoading(false);
        });
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

  const handleEdit = async (id) => {
    if (
      !bookName &&
      !author &&
      !genre &&
      !publisher &&
      !publicationDate &&
      !ISBN &&
      !status &&
      !bookImg
    ) {
      alert("Fill at least one field");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      };
      const data = await axios.put(
        `${ADMIN_API}/books/${id}`,
        {
          bookName,
          author,
          genre,
          publisher,
          publicationDate,
          status,
          ISBN,
          bookImg,
        },
        config
      );
      toast({
        title: "Book updated successfully",
        status: "success",
        duration: 500,
        isClosable: true,
        position: "top",
      });

      setIsOpen(false);
      setTimeout(() => {
        window.location.reload(true);
      }, 500);
    } catch (err) {
      // console.log(err);
      toast({
        title: "Updating book error",
        description: err?.response?.data?.data
          ? err?.response?.data?.data[0]?.message
          : err?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const currentRecords = books.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(books.length / recordsPerPage);
  const serialNumbers = currentRecords.map(
    (_, index) => indexOfFirstRecord + index + 1
  );

  useEffect(() => {
    getBooks();
  }, []);
  return (
    <>
      <div className="adm_book_wrapper">
        <Link to="/admin/add-book">
          <button
            className="btn"
            style={{ marginBottom: "20px", marginLeft: "20px" }}
          >
            Add Book
          </button>
        </Link>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>SN</Th>
                <Th>Book</Th>
                <Th>Author</Th>
                <Th>Genre</Th>
                <Th>ISBN</Th>
                <Th>Publisher</Th>
                <Th>Publication date</Th>
                <Th>status</Th>
                <Th>Created at</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentRecords.map((curElem, index) => {
                return (
                  <Tr key={curElem?._id}>
                    <Td>{serialNumbers[index]}</Td>
                    <Td>{curElem?.bookName}</Td>
                    <Td>{curElem?.author}</Td>
                    <Td>{curElem?.genre}</Td>
                    <Td>{curElem?.ISBN}</Td>
                    <Td>{curElem?.publisher}</Td>
                    <Td>{curElem?.publicationDate}</Td>
                    <Td>
                      {curElem.status ? (
                        <span className="status_true">Available</span>
                      ) : (
                        <span className="status_false">Not Available</span>
                      )}
                    </Td>
                    <Td>
                      {new Date(curElem.createdAt)
                        .toISOString()
                        .slice(0, 10)
                        .replace(/-/g, "/")}
                    </Td>
                    <Td>
                      <div className="table_action">
                        <button
                          className="small_btn_edit"
                          onClick={() => handleOpenModal(curElem)}
                        >
                          Edit
                        </button>

                        <Modal isOpen={isOpen} onClose={handleCloseModal}>
                          <ModalContent>
                            <ModalHeader>Book</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <FormControl>
                                <FormLabel>Book Name</FormLabel>
                                <Input
                                  type="text"
                                  onChange={(e) => setBookName(e.target.value)}
                                  placeholder={currentBook?.bookName}
                                />
                              </FormControl>

                              <FormControl>
                                <FormLabel>Author</FormLabel>
                                <Input
                                  type="text"
                                  onChange={(e) => setAuthor(e.target.value)}
                                  placeholder={currentBook?.author}
                                />
                              </FormControl>

                              <FormControl>
                                <FormLabel>Genre</FormLabel>
                                <Input
                                  type="text"
                                  onChange={(e) => setGenre(e.target.value)}
                                  placeholder={currentBook?.genre}
                                />
                              </FormControl>

                              <FormControl>
                                <FormLabel>Status</FormLabel>
                                <Input
                                  type="text"
                                  onChange={(e) => setStatus(e.target.value)}
                                  placeholder={
                                    currentBook?.status ? "true" : "false"
                                  }
                                />
                              </FormControl>

                              <FormControl>
                                <FormLabel>Publisher</FormLabel>
                                <Input
                                  type="text"
                                  onChange={(e) => setPublisher(e.target.value)}
                                  placeholder={currentBook?.publisher}
                                />
                              </FormControl>

                              <FormControl>
                                <FormLabel>Publication date</FormLabel>
                                <Input
                                  type="date"
                                  onChange={(e) =>
                                    setPublicationDate(e.target.value)
                                  }
                                  placeholder={currentBook?.publicationDate}
                                />
                              </FormControl>

                              <FormControl>
                                <FormLabel>ISBN</FormLabel>
                                <Input
                                  type="text"
                                  onChange={(e) => setISBN(e.target.value)}
                                  placeholder={currentBook?.ISBN}
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>ISBN</FormLabel>
                                <Input
                                  type="file"
                                  accept="/image/*"
                                  name="ISBN"
                                  onChange={(e) =>
                                    postDetails(e.target.files[0])
                                  }
                                  placeholder={
                                    <img src={currentBook?.bookImg} />
                                  }
                                />
                              </FormControl>

                              {loading ? (
                                <img className="spinner_small" src={spinner} />
                              ) : (
                                <Button
                                  colorScheme="blue"
                                  mr={3}
                                  onClick={() => handleEdit(currentBook?._id)}
                                >
                                  Submit
                                </Button>
                              )}
                            </ModalBody>
                          </ModalContent>
                        </Modal>

                        <button
                          className="small_btn_del"
                          onClick={() => handleDelete(curElem._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>

        <Pagination
          nPages={nPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default AdminBooks;
