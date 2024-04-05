import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { updateAssociate } from "../../features/user/userSlice";
const EditPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [associateId, setAssociateId] = useState("");
  const [location, setLocation] = useState("");
  const [facility, setFacility] = useState("");
  // const [submitForm, setSubmitForm] = useState(false)

  console.log(params.editId);
  useEffect(() => {
    const getAssociate = async () => {
      try {
        const { data } = await axios.get(`/associate/${params.editId}`, {
          headers: {
            "x-token": localStorage.getItem("token"),
          },
        });
        console.log(data);
        setAssociateId(data.associateId);
        setName(data.name);
        setFacility(data.facility);
        setLocation(data.location);
        // console.log(associate);
      } catch (err) {
        console.log(err);
      }
    };
    getAssociate();
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name);
    try {
      const { data } = await axios.patch(
        `/associate/${params.editId}`,
        {
          name,
          associateId,
          location,
          facility,
        },
        {
          headers: {
            "x-token": localStorage.getItem("token"),
          },
        }
      );
      console.log(data);
      dispatch(updateAssociate(data));
      toast.success("Details submitted succesfully", {
        position: "top-center",
      });
      // setSubmitForm(true)
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong! try again", {
        position: "top-center",
      });
    }
  };
  return (
    
    <div
      className="container  mt-3  justify-content-center align-items-center "
      style={{ maxWidth: "500px" }}
    >
      <div className="card mb-3 p-3" style={{ maxWidth: "500px" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 row">
            <label htmlFor="name" className="col-sm-4 col-md-3 col-form-label">
              Name
            </label>
            <div className="col-sm-8 col-md-9">
              <input
                type="text"
                value={name}
                className="form-control"
                id="name"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label
              htmlFor="associateId"
              className="col-sm-4 col-md-3 col-form-label"
            >
              Associate Id
            </label>
            <div className="col-sm-8 col-md-9">
              <input
                type="text"
                value={associateId}
                className="form-control"
                id="associateId"
                required
                onChange={(e) => setAssociateId(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label
              htmlFor="location"
              className="col-sm-4 col-md-3 col-form-label"
            >
              Location
            </label>
            <div className="col-sm-8 col-md-9">
              <input
                type="text"
                value={location}
                className="form-control"
                id="location"
                required
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label
              htmlFor="facility"
              className="col-sm-4 col-md-3 col-form-label"
            >
              Facility
            </label>
            <div className="col-sm-8 col-md-9">
              <input
                type="text"
                value={facility}
                className="form-control"
                id="facility"
                required
                onChange={(e) => setFacility(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3 text-center">
            <button type="submit" className="btn btn-primary">
              submit
            </button>
          </div>
          <ToastContainer />
        </form>
      </div>
    </div>
  );
};

export default EditPage;
