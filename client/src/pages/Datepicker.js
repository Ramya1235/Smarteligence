import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-calendar/dist/Calendar.css";

function Datepicker({ id }) {
  const [selectedDates, setSelectedDates] = useState([]);
  console.log(new Date());

  const handleDateClick = (date) => {
    console.log(selectedDates);
    console.log(date, typeof date);
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter((d) => d !== date));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleSaveToDatabase = async () => {
    const checkindates = selectedDates.map((date, index) =>
      moment(date).format("YYYY-MM-DD")
    );
    const finalCheckinDates = [...new Set(checkindates)];
    try {
      await axios.post("/save-dates", {
        id,
        dates: finalCheckinDates,
      });
      toast.success("Your checkin is submitted succesfully", {
        position: "top-center",
      });
      console.log("Dates saved to the database:", finalCheckinDates);
    } catch (error) {
      console.error("Error saving dates to the database:", error);
      toast.error("Something went wrong! try again", {
        position: "top-center",
      });
    }
  };

  return (
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
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Select the dates you want to checkin
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <Calendar
              onClickDay={handleDateClick}
              //   tileClassName={({ date, view }) =>
              //   selectedDates.some((d) => d.toDateString() === date.toDateString())
              //     ? "highlight"
              //     : ""
              // }
              tileDisabled={({ date }) => {
                const currentDate = new Date();
                return date > currentDate ? true : false;
              }}
            />
            
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveToDatabase}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Datepicker;
