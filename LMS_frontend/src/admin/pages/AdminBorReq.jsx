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

const AdminBorReq = () => {
  const [borrowReqs, setBorrowReqs] = useState([]);
  const {
    token,
    toast,
    currentPage,
    setCurrentPage,
    recordsPerPage,
    indexOfLastRecord,
    indexOfFirstRecord,
  } = BookState();

  const getBorrowReqs = async (token) => {
    const { accessToken } = token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const data = await axios.get(`${ADMIN_API}/borrow-requests`, config);
      setBorrowReqs(data.data);
    } catch (err) {}
  };

  const handleAcceptBorrow = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    };

    try {
      const confirmPrompt = window.confirm("Are you sure want to accept?");
      if (confirmPrompt) {
        const data = await axios.put(
          `${ADMIN_API}/borrow-requests/${id}`,
          { status: "accepted" },
          config
        );
        if (data.status === 200) {
          toast({
            title: "Borrow request accepted successfully",
            status: "success",
            duration: 600,
            isClosable: true,
            position: "top",
          });

          setTimeout(() => {
            window.location.reload(true);
          }, 600);
        }
      }
    } catch (err) {
      // console.log(err);
      toast({
        title: "Borrow request acceptance error",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleRejectBorrow = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    };

    try {
      const confirmPrompt = window.confirm("Are you sure want to reject?");

      if (confirmPrompt) {
        const data = await axios.put(
          `${ADMIN_API}/borrow-requests/${id}`,
          { status: "rejected" },
          config
        );
        if (data.status === 200) {
          toast({
            title: "Borrow request rejected",
            status: "error",
            duration: 600,
            isClosable: true,
            position: "top",
          });

          setTimeout(() => {
            window.location.reload(true);
          }, 600);
          return;
        }
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Borrow request rejection error",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const currentRecords = borrowReqs.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const nPages = Math.ceil(borrowReqs.length / recordsPerPage);
  const serialNumbers = currentRecords.map(
    (_, index) => indexOfFirstRecord + index + 1
  );

  useEffect(() => {
    getBorrowReqs(token);
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
              <Th>Created at</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentRecords.map((curElem, index) => {
              return (
                <Tr key={curElem._id}>
                  <Td>{serialNumbers[index]}</Td>
                  <Td>
                    {curElem?.userId?.firstName} {curElem?.userId?.lastName}
                  </Td>
                  <Td>{curElem?.bookId?.bookName}</Td>
                  <Td>{`${curElem?.status
                    .charAt(0)
                    .toUpperCase()}${curElem?.status.slice(1)}`}</Td>
                  <Td>
                    {curElem?.createdAt
                      ? new Date(curElem.createdAt)
                          .toISOString()
                          .slice(0, 10)
                          .replace(/-/g, "/")
                      : ""}
                  </Td>

                  <Td>
                    {curElem?.status === "accepted" ||
                    curElem?.status === "rejected" ? (
                      " "
                    ) : (
                      <div className="table_action">
                        <button
                          className="small_btn_edit"
                          onClick={() => handleAcceptBorrow(curElem._id)}
                        >
                          Accept
                        </button>
                        <button
                          className="small_btn_del"
                          onClick={() => handleRejectBorrow(curElem._id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
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

export default AdminBorReq;
