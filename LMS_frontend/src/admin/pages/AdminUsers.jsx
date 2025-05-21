import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { ADMIN_API, BookState } from "../../context/BookProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../../components/Pagination";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const {
    token,
    toast,
    currentPage,
    setCurrentPage,
    recordsPerPage,
    indexOfLastRecord,
    indexOfFirstRecord,
  } = BookState();
  // const navigateTo = useNavigate();

  const getUsers = async (token) => {
    const { accessToken } = token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const data = await axios.get(`${ADMIN_API}/users`, config);
      setUsers(data.data);
    } catch (err) {
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

  const handleDelete = async (id) => {
    try {
      const shouldDelete = window.confirm("Are you sure want to delete?");

      if (shouldDelete) {
        const config = {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        };
        const data = await axios.delete(`${ADMIN_API}/users/${id}`, config);
        if (data.status === 200) {
          toast({
            title: "User deleted successfully",
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
      // console.log(err);
      toast({
        title: "Deleting user error",
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

  const currentRecords = users.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(users.length / recordsPerPage);
  const serialNumbers = currentRecords.map(
    (_, index) => indexOfFirstRecord + index + 1
  );

  useEffect(() => {
    getUsers(token);
  }, []);

  return (
    <div className="adm_book_wrapper">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>SN</Th>
              <Th>First name</Th>
              <Th>Last name</Th>
              <Th>Email</Th>
              <Th>Created at</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentRecords.map((curElem, index) => {
              return (
                <Tr key={curElem._id}>
                  <Td>{serialNumbers[index]}</Td>
                  <Td>{curElem?.firstName}</Td>
                  <Td>{curElem?.lastName}</Td>
                  <Td>{curElem?.email}</Td>
                  <Td>
                    {curElem.createdAt
                      ? new Date(curElem.createdAt)
                          .toISOString()
                          .slice(0, 10)
                          .replace(/-/g, "/")
                      : ""}
                  </Td>

                  <Td>
                    <div className="table_action">
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

export default AdminUsers;
