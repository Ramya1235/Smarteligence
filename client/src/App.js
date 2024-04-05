import "./App.css";
import SigninPage from "./pages/SigninPage";
import ForgetPassword from "./pages/ForgetPassword";
import AdminPage from "./pages/Admin/AdminPage";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EditPage from "./pages/Admin/EditPage";
import Associates from "./pages/Admin/Associates";
import Report from "./pages/Admin/Report";
import Header from "./components/Header";
import AddAssociate from "./pages/Admin/AddAssociate";
import Profile from "./pages/Profile";
import PasswordChange from "./pages/PasswordChange";
import CheckInDates from "./pages/User/CheckInDates";
import UserPage from "./pages/User/UserPage";

function App() {
  return (
    <div className="container-fluid">
      <div className="d-flex flex-column site-container">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SigninPage />} />
          <Route path="/admin/:id" element={<AdminPage />}>
            <Route path="checkInDates" element={<CheckInDates />} />
            <Route path="associates" element={<Associates />}>
              <Route path="edit/:editId" element={<EditPage />} />
            </Route>
            <Route path="report" element={<Report />} />
            <Route path="associate-registration" element={<AddAssociate />} />
            <Route path="profile" element={<Profile />}>
              <Route path="change-password" element={<PasswordChange />} />
            </Route>
            <Route path="report" element={<Report />} />
          </Route>
          <Route path="/associate/:id" element={<UserPage />}>
            <Route path="profile" element={<Profile />}>
              <Route path="change-password" element={<PasswordChange />} />
            </Route>

            <Route path="checkInDates" element={<CheckInDates />} />
          </Route>
          <Route path="/Login/reset-password" element={<ForgetPassword />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
