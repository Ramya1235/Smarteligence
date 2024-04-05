import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const UserPage = () => {
  return (
    <div className="mt-5">
      <div className="container">
        <div className="add_btn mt-2 mb-2"></div>
        <ul className="nav">
          <li className="nav-item">
            <NavLink to="profile" className="nav-link routes">
              My profile
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="checkInDates" className="nav-link routes">
              checkInDates
            </NavLink>
          </li>
        </ul>
        <Outlet /> 
      </div>
    </div>
  );
};

export default UserPage;
