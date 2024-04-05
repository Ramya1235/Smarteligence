import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, Outlet } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import { FaUserEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";

import {
  deleteAssociate,
  getAssociatesList,
} from "../../features/user/userSlice";
import "./Associates.scss";

const Associates = () => {
  const [checkInDates, setCheckInDates] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const associatesList = useSelector((state) => state.user.associatesList);

  const handleGetDetails = async (userId) => {
    try {
      console.log(userId);
      const response = await axios.get(`/associate/${userId}/dates`);
      const formattedDates = response.data.savedDates.map((isDate) => {
        return new Date(isDate);
      });
      setCheckInDates(formattedDates);

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching check-in dates:", error);
    }
  };

  useEffect(() => {
    const getAssociates = async () => {
      try {
        const { data } = await axios.get("/associates", {
          headers: {
            "x-token": localStorage.getItem("token"),
          },
        });
        console.log(data);
        dispatch(getAssociatesList(data));
      } catch (err) {
        console.log(err);
      }
    };
    getAssociates();
  }, [navigate, dispatch]);

  console.log(associatesList);
  const handleDeleteAssociate = async (id) => {
    const { data } = await axios.delete(`/delete/associate/${id}`, {
      headers: {
        "x-token": localStorage.getItem("token"),
      },
    });
    console.log(data);
    dispatch(deleteAssociate(data));
  };

  const isDateDisabled = (date) => !checkInDates.includes(date);

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr className="table-light">
              <th>SI.No</th>
              <th>Name</th>
              <th>Associate Id</th>
              <th>Facility</th>
              <th>Location</th>
              <th>Edit</th>
              <th>CheckIn Details</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(associatesList)?(
              
              associatesList.map((element, index) => {
                return (
                
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{element.name}</td>
                      <td>{element.associateId}</td>
                      <td>{element.facility}</td>
                      <td>{element.location}</td>
  
                      <td className="d-flex justify-content-between">
                        <Link to={`edit/${element._id}`}>
                          <button className="btn btn-primary">
                            <FaUserEdit />
                          </button>
                        </Link>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-info"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => handleGetDetails(element._id)}
                        >
                          Get Details
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteAssociate(element._id)}
                        >
                          <AiOutlineDelete />
                        </button>
                      </td>
                    </tr>
              
                );
              })
            ):(
              <p>not array</p>
            )}
          </tbody>
        </table>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title" id="exampleModalLabel">
                  Check-in Dates
                </h3>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body ps-5 ms-4">
                {checkInDates.length > 0 ? (
                  <div>
                    <Calendar
                      value={checkInDates}
                      tileClassName={({ date, view }) =>
                        checkInDates.some(
                          (d) => d.toDateString() === date.toDateString()
                        )
                          ? "highlight"
                          : ""
                      }
                      tileDisabled={({ date }) => isDateDisabled(date)}
                    />
                  </div>
                ) : (
                  <p>No Check-in dates are available</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default Associates;
