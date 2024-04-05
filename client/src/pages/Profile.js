import React from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaIdCard, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import Datepicker from "./Datepicker";

const Profile = () => {
  const checkinToday = useSelector((state) => state.user.checkinToday);
  console.log(checkinToday);
  const associate = useSelector((state) => state.user.associate);
  const { id } = associate;
  return (
    <div className="container  mt-3  justify-content-center align-items-center ">
      <div>
        <div
          className="container  mt-3  justify-content-center align-items-center "
          style={{ maxWidth: "500px" }}
        >
          <div className="card mb-3">
            <div className="card-body">
              <h1 style={{ fontWeight: 400 }}>
                Welcome {associate.associateId}
              </h1>

              <div className="add_btn"></div>
              <div className="row">
                <div className="left_view col-lg-4 col-md-6 col-12 mt-3 ps-5">
                  <img
                    src="/profile.png"
                    style={{ width: 100 }}
                    alt="profile"
                  />
                </div>
                <div className="col-lg-8 col-md-6 col-12 ps-5">
                  <h6 className="mt-3">
                    <FaUser /> Name: <span>{associate.name}</span>
                  </h6>
                  <h6 className="mt-3">
                    <FaIdCard /> AssociateId:{" "}
                    <span>{associate.associateId}</span>
                  </h6>
                  <h6 className="mt-3">
                    <FaBuilding /> Facility: <span>{associate.facility}</span>
                  </h6>
                  <h6 className="mt-3">
                    <FaMapMarkerAlt /> Location:{" "}
                    <span>{associate.location}</span>
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="button-container">
          <Link to="change-password">
            <button type="button" className="btn btn-info">
              ChangePassword
            </button>
          </Link>
          <button
            type="button"
            className="btn btn-primary ms-3"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            CheckIn
          </button>
          </div>
          <Datepicker id={id} />
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Profile;
