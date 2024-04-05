import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PasswordChange = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const associate = useSelector((state) => state.user.associate);
  const params = useParams();
  console.log(params.id);
  useEffect(() => {
    // reseting the form fields empty after successful submission
    if (isSubmitSuccessful) {
      reset({
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [isSubmitSuccessful, reset]);
  const onSubmit = async (data) => {
    let requiredDetails = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };
    try {
      const { data } = await axios.put(
        `/password-change/${associate.id}`,
        requiredDetails
      );
      console.log(data);
      toast.success("Password has been changed succesfully", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! try again", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="container  mt-3  justify-content-center">
      <div className="card mb-3">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 row">
              <label
                htmlFor="currentPassword"
                className="col-md-4 col-form-label"
              >
                currentPassword
              </label>
              <div className="col-md-8">
                <input
                  type="text"
                  name="currentPassword"
                  className="form-control"
                  id="currentPassword"
                  {...register("currentPassword", {
                    required: "Please enter the Associate Name.",
                  })}
                />
                {errors.currentPassword && (
                  <p className="text-danger">
                    *{errors.currentPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3 row">
              <label htmlFor="newPassword" className="col-md-4 col-form-label">
                newPassword
              </label>
              <div className="col-md-8">
                <div className="input-group">
                  <input
                    type="newPassword"
                    name="newPassword"
                    className="form-control"
                    id="newPassword"
                    {...register("newPassword", {
                      required: "Please enter the newPassword.",
                    })}
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-danger">*{errors.newPassword.message}</p>
                )}
              </div>
            </div>
            <div className="mb-3 text-center">
              <button type="submit" className="btn btn-primary">
                submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PasswordChange;
