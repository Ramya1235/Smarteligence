import React from "react";
import { NavLink, Outlet} from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="mt-3">
      <div className="container">
        <div className="add_btn mt-2 mb-2"></div>
        <ul className='nav mb-3'>
          <li className='nav-item'>
            <NavLink to='associates' className='nav-link routes'>
              Associates
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='report' className='nav-link routes'>
              Report
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='associate-registration' className='nav-link routes'>
              AddAssociate
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='profile' className='nav-link routes'>
              My profile
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='checkInDates' className='nav-link routes'>
              checkInDates
            </NavLink>
          </li>
        </ul>
        <Outlet />
      </div>
    </div>
  )
};

export default AdminPage;
