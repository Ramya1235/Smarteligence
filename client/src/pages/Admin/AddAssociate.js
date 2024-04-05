import React, { useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAssociate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      associateId: "",
      location: "",
      facility: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    // reseting the form fields empty after successful submission
    if (isSubmitSuccessful) {
      reset({
        name: "",
        associateId: "",
        location: "",
        facility: "",
        email: "",
        password: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = async (data) => {
    let associateDetails = {
      name: data.name,
      associateId: data.associateId,
      location: data.location,
      facility: data.facility,
      email: data.email,
      password: data.password,
    };
    try {
      const { data } = await axios.post("/register", associateDetails);
      console.log(data);
      toast.success("Details submitted succesfully", {
        position: "top-center",
      });
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
      <div className="card mb-3" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 row">
              <label
                htmlFor="name"
                className="col-sm-4 col-md-3 col-form-label"
              >
                Name
              </label>
              <div className="col-sm-8 col-md-9">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="name"
                  {...register("name", {
                    required: "Please enter the Associate Name.",
                    pattern: {
                      value: /^[A-Z a-z]+$/,
                      message: "Only characters are allowed.",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-danger">*{errors.name.message}</p>
                )}
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
                  type="numeric"
                  name="associateId"
                  className="form-control"
                  id="associateId"
                  {...register("associateId", {
                    required: "Please enter the Associate Id.",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Only digits are allowed.",
                    },
                  })}
                />
                {errors.associateId && (
                  <p className="text-danger">*{errors.associateId.message}</p>
                )}
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
                  name="location"
                  className="form-control"
                  id="location"
                  {...register("location", {
                    required: "Please enter the location",
                    pattern: {
                      value: /^[A-Z a-z]+$/,
                      message: "Only characters are allowed.",
                    },
                  })}
                />
                {errors.location && (
                  <p className="text-danger">*{errors.location.message}</p>
                )}
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
                  name="facility"
                  className="form-control"
                  id="facility"
                  {...register("facility", {
                    required: "Please enter the facility",
                    pattern: {
                      value: /^[A-Z a-z]+$/,
                      message: "Only characters are allowed.",
                    },
                  })}
                />
                {errors.facility && (
                  <p className="text-danger">*{errors.facility.message}</p>
                )}
              </div>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="email"
                className=" col-sm-4 col-md-3 col-form-label"
              >
                email
              </label>
              <div className="col-sm-8 col-md-9">
                <input
                  type="text"
                  name="email"
                  className="form-control"
                  id="email"
                  {...register("email", {
                    required: "Please enter the Associate Name.",
                    pattern: {
                      value: /^[a-z0-9]+@gmail\.com$/gim,
                      message: "Please enter valid email.",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-danger">*{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="password"
                className=" col-sm-4 col-md-3 col-form-label"
              >
                password
              </label>
              <div className="col-sm-8 col-md-9">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="password"
                  {...register("password", {
                    required: "Please enter the Associate Name.",
                  })}
                />
                {errors.password && (
                  <p className="text-danger">*{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="button-container">
              <button type="submit" className="btn btn-primary">
                submit
              </button>
            </div>
            <ToastContainer />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAssociate;