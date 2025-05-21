import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import UserPage from "./pages/UserPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminNavbar from "./admin/pages/AdminNavbar";
import AdminSignin from "./admin/pages/AdminSignin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminBooks from "./admin/pages/AdminBooks";
import AdminBorReq from "./admin/pages/AdminBorReq";
import AdminRetReq from "./admin/pages/AdminRetReq";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminInventories from "./admin/pages/AdminInventories";
import AdminBorrows from "./admin/pages/AdminBorrows";
import AdminReturns from "./admin/pages/AdminReturns";
import AddBook from "./admin/pages/AddBook";
import { BookState } from "./context/BookProvider";
import AdminConfigure from "./admin/pages/AdminConfigure";
import AdminProfile from "./admin/pages/AdminProfile";
// import PrivateRoutes from "./admin/PrivateRoutes";

function App() {
  const url = window.location.pathname;
  const first_url = url.split("/")[1];
  const { token, role } = BookState();
  return (
    <>
      {first_url === "admin" ? (
        token && role === "admin" ? (
          <div className="admin_page">
            <AdminNavbar />
            <Routes>
              <Route>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/books" element={<AdminBooks />} />
                <Route
                  path="/admin/borrow-requests"
                  element={<AdminBorReq />}
                />
                <Route
                  path="/admin/return-requests"
                  element={<AdminRetReq />}
                />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route
                  path="/admin/inventories"
                  element={<AdminInventories />}
                />
                <Route path="/admin/borrows" element={<AdminBorrows />} />
                <Route path="/admin/returns" element={<AdminReturns />} />
                <Route path="/admin/add-book" element={<AddBook />} />
                <Route path="/admin/config" element={<AdminConfigure />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
              </Route>
            </Routes>
          </div>
        ) : (
          <Routes>
            <Route path="/admin/signin" element={<AdminSignin />} />
          </Routes>
        )
      ) : (
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/books" element={<Books />} />
            <Route path="/users/:id" element={<UserPage />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
