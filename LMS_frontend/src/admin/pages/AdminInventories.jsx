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

const AdminInventories = () => {
  const [inventories, setInventories] = useState([]);
  const {
    token,
    toast,
    currentPage,
    setCurrentPage,
    recordsPerPage,
    indexOfLastRecord,
    indexOfFirstRecord,
  } = BookState();
  const [isOpen, setIsOpen] = useState(false);
  const [currentInventory, setCurrentInventory] = useState();
  const [totalQuantity, setToalQuantity] = useState();
  const [availableQuantity, setAvailableQuantity] = useState();

  const handleOpenModal = (curElem) => {
    setCurrentInventory(curElem);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const navigateTo = useNavigate();

  const getInventories = async (token) => {
    const { accessToken } = token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const data = await axios.get(`${ADMIN_API}/inventories`, config);
      setInventories(data.data);
    } catch (err) {
      toast({
        title: err?.response?.data?.data
          ? err?.response?.data?.data[0]?.message
          : err?.response?.data?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      navigateTo("/admin/signin");
    }
  };

  const handleEdit = async (id) => {
    if (!totalQuantity && !availableQuantity) {
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
        `${ADMIN_API}/inventories/${id}`,
        {
          totalQuantity,
          availableQuantity,
        },
        config
      );
      toast({
        title: "Inventory updated successfully",
        status: "success",
        duration: 500,
        isClosable: true,
        position: "top",
      });
      setTimeout(() => {
        window.location.reload(true);
      }, 500);
      setIsOpen(false);
    } catch (err) {
      toast({
        title: "Updating inventory error",
        description: err?.response?.data?.data
          ? err?.response?.data?.data[0]?.message
          : err?.response?.data?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
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

        const data = await axios.delete(
          `${ADMIN_API}/inventories/${id}`,
          config
        );

        toast({
          title: "Inventory Book deleted successfully",
          status: "success",
          duration: 500,
          isClosable: true,
          position: "top",
        });

        setTimeout(() => {
          window.location.reload(true);
        }, 500);
      }
    } catch (err) {
      toast({
        title: "Deleting inventory book error",
        description: err?.response?.data?.data
          ? err?.response?.data?.data[0]?.message
          : err?.response?.data?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const currentRecords = inventories.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const nPages = Math.ceil(inventories.length / recordsPerPage);
  const serialNumbers = currentRecords.map(
    (_, index) => indexOfFirstRecord + index + 1
  );

  useEffect(() => {
    getInventories(token);
  }, []);

  return (
    <div className="adm_book_wrapper">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>SN</Th>
              <Th>Book</Th>
              <Th>Total Quantity</Th>
              <Th>Available Quantity</Th>
              <Th>Created at</Th>
              <Th>Updated at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentRecords.map((curElem, index) => {
              return (
                <Tr key={curElem._id}>
                  <Td>{serialNumbers[index]}</Td>
                  <Td>{curElem?.bookId?.bookName}</Td>
                  <Td>{curElem?.totalQuantity}</Td>
                  <Td>{curElem?.availableQuantity}</Td>
                  <Td>
                    {curElem?.createdAt
                      ? new Date(curElem.createdAt)
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
                      <button
                        className="small_btn_edit"
                        onClick={() => handleOpenModal(curElem)}
                      >
                        Edit
                      </button>

                      <Modal isOpen={isOpen} onClose={handleCloseModal}>
                        {/* <ModalOverlay /> */}
                        <ModalContent>
                          <ModalHeader>Inventory</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <FormControl>
                              <FormLabel>Total Quantity</FormLabel>
                              <Input
                                type="number"
                                onChange={(e) =>
                                  setToalQuantity(Number(e.target.value))
                                }
                                placeholder={currentInventory?.totalQuantity}
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel>Available Quantity</FormLabel>
                              <Input
                                type="number"
                                onChange={(e) =>
                                  setAvailableQuantity(Number(e.target.value))
                                }
                                placeholder={
                                  currentInventory?.availableQuantity
                                }
                              />
                            </FormControl>

                            <Button
                              colorScheme="blue"
                              mr={3}
                              onClick={() => handleEdit(currentInventory?._id)}
                            >
                              Submit
                            </Button>
                          </ModalBody>
                        </ModalContent>
                      </Modal>

                      <p
                        className="small_btn_del"
                        onClick={() => handleDelete(curElem?._id)}
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

export default AdminInventories;
