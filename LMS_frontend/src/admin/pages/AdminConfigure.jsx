import React, { useEffect, useState } from "react";
import { ADMIN_API, BookState } from "../../context/BookProvider";
import axios from "axios";
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

const AdminConfigure = () => {
  const { token, toast } = BookState();
  const [configData, setConfigData] = useState();
  const [config, setCurrentconfig] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [borrowDays, setBorrowDays] = useState();
  const [borrowLimit, setBorrowLimit] = useState();
  const [finePerDay, setFinePerDay] = useState();

  const handleOpenModal = (curElem) => {
    setCurrentconfig(curElem);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const getConfig = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      };
      const { data } = await axios.get(`${ADMIN_API}/users/config`, config);

      setConfigData(data);
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
    }
  };

  const handleEdit = async () => {
    if (!borrowDays && !borrowLimit && !finePerDay) {
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
        `${ADMIN_API}/users/config`,
        {
          borrowDays,
          borrowLimit,
          finePerDay,
        },
        config
      );
      toast({
        title: "configs updated successfully",
        status: "success",
        duration: 1000,
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
        title: "Updating configs error",
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
  useEffect(() => {
    if (token) {
      getConfig(token);
    }
  }, []);

  return (
    <div>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Borrow Limit</Th>
              <Th>Borrow days</Th>
              <Th>Fine per day</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{configData?.borrowLimit}</Td>
              <Td>{configData?.borrowDays}</Td>
              <Td>{configData?.finePerDay}</Td>

              <Td>
                {" "}
                <div className="table_action">
                  <button className="small_btn_edit" onClick={handleOpenModal}>
                    Edit
                  </button>
                  <Modal isOpen={isOpen} onClose={handleCloseModal}>
                    {/* <ModalOverlay /> */}
                    <ModalContent>
                      <ModalHeader>Config data</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <FormControl>
                          <FormLabel>Borrow Limit</FormLabel>
                          <Input
                            type="text"
                            onChange={(e) =>
                              setBorrowLimit(Number(e.target.value))
                            }
                            placeholder={configData?.borrowLimit}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Borrow days</FormLabel>
                          <Input
                            type="number"
                            onChange={(e) =>
                              setBorrowDays(Number(e.target.value))
                            }
                            placeholder={configData?.borrowDays}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Fine per day</FormLabel>
                          <Input
                            type="text"
                            onChange={(e) =>
                              setFinePerDay(Number(e.target.value))
                            }
                            placeholder={configData?.finePerDay}
                          />
                        </FormControl>

                        <Button colorScheme="blue" mr={3} onClick={handleEdit}>
                          Submit
                        </Button>
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </div>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default AdminConfigure;
