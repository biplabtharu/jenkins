import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { ADMIN_API, BookState } from "../../context/BookProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../../components/Pagination";

const AdminBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const {
    token,
    toast,
    currentPage,
    setCurrentPage,
    recordsPerPage,
    indexOfLastRecord,
    indexOfFirstRecord,
  } = BookState();
  // const [isOpen, setIsOpen] = useState(false);
  // const [currentBorrows, setCurrentBorrows] = useState();
  const [borrowStatus, setBorrowStatus] = useState();
  const [returnOrder, setReturnOrder] = useState();

  const navigateTo = useNavigate();

  // const handleOpenModal = (curElem) => {
  //   console.log(curElem);
  //   setCurrentBorrows(curElem);
  //   setIsOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsOpen(false); // Close the modal
  // };

  const getBorrows = async (token) => {
    const { accessToken } = token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const data = await axios.get(`${ADMIN_API}/borrows`, config);
      setBorrows(data.data);
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      };
      const confirmPrompt = window.confirm("Are you sure want to delete?");

      if (confirmPrompt) {
        const data = await axios.delete(`${ADMIN_API}/borrows/${id}`, config);
        if (data.status === 200) {
          toast({
            title: "Borrowed data deleted successfully",
            status: "success",
            duration: 500,
            isClosable: true,
            position: "top",
          });

          setTimeout(() => {
            window.location.reload(true);
          }, 500);
        }
      }
    } catch (err) {
      toast({
        title: "Deleting borrowed data error",
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

  // const handleEdit = async (id) => {
  //   if (!borrowStatus && !returnOrder) {
  //     alert("Fill at least one field");
  //     return;
  //   }
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${token.accessToken}`,
  //       },
  //     };

  //     const data = await axios.put(
  //       `${ADMIN_API}/borrows/${id}`,
  //       {
  //         status: Boolean(borrowStatus),
  //         returnOrder,
  //       },
  //       config
  //     );
  //     console.log(data);
  //     toast({
  //       title: "Borrow data updated successfully",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "top",
  //     });
  //     setIsOpen(false);
  //   } catch (err) {
  //     toast({
  //       title: "Updating borrow data error",
  //       description: err?.response?.data?.data
  //         ? err?.response?.data?.data[0]?.message
  //         : err?.response?.data?.message,
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "top",
  //     });
  //   }
  // };

  // const handleReturnOrder = (e) => {
  //   setReturnOrder(e.target.value);
  // };

  const currentRecords = borrows.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(borrows.length / recordsPerPage);
  const serialNumbers = currentRecords.map(
    (_, index) => indexOfFirstRecord + index + 1
  );

  useEffect(() => {
    getBorrows(token);
  }, []);

  return (
    <div className="adm_book_wrapper">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>SN</Th>
              <Th>User</Th>
              <Th>Book</Th>
              <Th>Status</Th>
              <Th>Return order</Th>
              <Th>Borrowed at</Th>
              <Th>Due date</Th>
              <Th>Updated at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentRecords.map((curElem, index) => {
              return (
                <Tr key={curElem._id}>
                  <Td>{serialNumbers[index]}</Td>
                  <Td>
                    {curElem?.user?.firstName} {curElem.user?.lastName}
                  </Td>
                  <Td>{curElem?.book?.bookName}</Td>
                  <Td>{curElem?.status ? "Borrowed" : "Returned"}</Td>
                  <Td>{`${curElem?.returnOrder
                    .charAt(0)
                    .toUpperCase()}${curElem?.returnOrder.slice(1)}`}</Td>
                  <Td>
                    {curElem?.createdAt
                      ? new Date(curElem.createdAt)
                          .toISOString()
                          .slice(0, 10)
                          .replace(/-/g, "/")
                      : ""}
                  </Td>
                  <Td>
                    {curElem?.dueDate
                      ? new Date(curElem.dueDate)
                          .toISOString()
                          .slice(0, 10)
                          .replace(/-/g, "/")
                      : ""}
                  </Td>
                  <Td>
                    {curElem?.updatedAt
                      ? new Date(curElem.updatedAt)
                          .toISOString()
                          .slice(0, 10)
                          .replace(/-/g, "/")
                      : ""}
                  </Td>

                  <Td>
                    <div className="table_action">
                      {/* <button
                        className="small_btn_edit"
                        onClick={() => handleOpenModal(curElem)}
                      >
                        Edit
                      </button> */}

                      {/* <Modal isOpen={isOpen} onClose={handleCloseModal}>
                        <ModalContent>
                          <ModalHeader>Borrows</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <FormControl>
                              <FormLabel>Borrow status</FormLabel>
                              <Input
                                type="text"
                                onChange={(e) =>
                                  setBorrowStatus(e.target.value)
                                }
                                placeholder={currentBorrows?.status.toString()}
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel>Return Order</FormLabel>

                              <select onChange={handleReturnOrder}>
                                <option>{curElem?.returnOrder}</option>
                                <option value="placed">placed</option>
                                <option value="not_placed">not_placed</option>
                                <option value="accepted">accepted</option>
                                <option value="rejected">rejected</option>
                              </select>
                            </FormControl>

                            <Button
                              colorScheme="blue"
                              mr={3}
                              onClick={() => handleEdit(currentBorrows?._id)}
                            >
                              Submit
                            </Button>
                          </ModalBody>
                        </ModalContent>
                      </Modal> */}
                      <p
                        className="small_btn_del"
                        onClick={() => handleDelete(curElem._id)}
                      >
                        Delete
                      </p>
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
  );
};

export default AdminBorrows;
