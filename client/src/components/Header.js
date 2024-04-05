import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../features/user/userSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const associate = useSelector((state) => state.user.associate);

  const handleLogOut = () => {
    dispatch(userLogout());
    navigate("/");
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container p-0">
          <Link to="/">
            <h4 className="navbar-brand mb-0 text-white">Smarteligence</h4>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {associate ? (
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle pointer text-white"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaRegUser /> {associate.name}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <button
                        onClick={() => handleLogOut()}
                        type="button"
                        className="btn btn-primary dropdown-item"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li>
                  <Link to={"/Login"}>
                    <button type="button" className="btn btn-primary">
                      Login
                    </button>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
