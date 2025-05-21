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

const AdminRetReq = () => {
  const [returnReqs, setReturnReqs] = useState([]);
  const {
    token,
    currentPage,
    setCurrentPage,
    recordsPerPage,
    indexOfLastRecord,
    indexOfFirstRecord,
    toast,
  } = BookState();

  const getBorrowReqs = async (token) => {
    const { accessToken } = token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const data = await axios.get(`${ADMIN_API}/return-requests`, config);
      setReturnReqs(data.data);
    } catch (err) {}
  };

  const handleAcceptReturn = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    };

    try {
      const confirmPrompt = window.confirm("Are you sure want to accept?");
      if (confirmPrompt) {
        const data = await axios.put(
          `${ADMIN_API}/return-requests/${id}`,
          { status: "accepted" },
          config
        );
        if (data.status === 200) {
          toast({
            title: "Return request accepted successfully",
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
        title: "Return request acceptance error",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleRejectReturn = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    };

    try {
      const confirmPrompt = window.confirm("Are you sure want to reject?");
      if (confirmPrompt) {
        const data = await axios.put(
          `${ADMIN_API}/return-requests/${id}`,
          { status: "rejected" },
          config
        );
        if (data.status === 200) {
          toast({
            title: "Return request rejected",
            status: "error",
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
        title: "Return request rejection error",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const currentRecords = returnReqs.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const nPages = Math.ceil(returnReqs.length / recordsPerPage);
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
                    {curElem.userId?.firstName} {curElem.userId?.lastName}
                  </Td>
                  <Td>{curElem.bookId?.bookName}</Td>
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
                    {curElem.status === "accepted" ||
                    curElem.status === "rejected" ? (
                      ""
                    ) : (
                      <div className="table_action">
                        <p
                          className="small_btn_edit"
                          onClick={() => handleAcceptReturn(curElem._id)}
                        >
                          Accept
                        </p>
                        <p
                          className="small_btn_del"
                          onClick={() => handleRejectReturn(curElem._id)}
                        >
                          Reject
                        </p>
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

export default AdminRetReq;
