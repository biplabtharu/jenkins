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
import axios from "axios";
import Pagination from "../../components/Pagination";

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const {
    token,
    toast,
    currentPage,
    setCurrentPage,
    recordsPerPage,
    indexOfLastRecord,
    indexOfFirstRecord,
  } = BookState();

  const getReturns = async (token) => {
    const { accessToken } = token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const data = await axios.get(`${ADMIN_API}/returns`, config);
      setReturns(data.data);
    } catch (err) {
      // console.log(err);
      toast({
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
      const config = {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      };

      const confirmPrompt = window.confirm("Are you sure want to delete?");

      if (confirmPrompt) {
        const data = await axios.delete(`${ADMIN_API}/returns/${id}`, config);
        if (data.status === 200) {
          toast({
            title: "Returned data deleted successfully",
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
        title: "Deleting return data error",
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

  const currentRecords = returns.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(returns.length / recordsPerPage);
  const serialNumbers = currentRecords.map(
    (_, index) => indexOfFirstRecord + index + 1
  );

  useEffect(() => {
    getReturns(token);
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
              <Th>Returned at</Th>
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
                  <Td>{curElem?.status ? "Returned" : "Not returned"}</Td>
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
                      {/* <p className="small_btn_edit">Edit</p> */}
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

export default AdminReturns;
