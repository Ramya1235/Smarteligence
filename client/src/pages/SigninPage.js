import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { userLogin } from "../features/user/userSlice";
import jwt_decode from "jwt-decode";
import { NavLink } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SigninScreen() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginToday = async (id) => {
    const todayDate = moment(new Date()).format("YYYY-MM-DD");

    try {
      await axios.post("/save-dates", {
        id,
        dates: [todayDate],
      });
      toast.success("Your checkin is succesfully", {
        position: "top-center",
      });
      console.log("Dates saved to the database:", todayDate);
    } catch (error) {
      console.error("Error saving dates to the database:", error);
      toast.error("Something went wrong! try again", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        associateId: "",
        password: "",
        userName: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = async (data) => {
    let associate = {
      userName: data.associateId,
      password: data.password,
    };

    try {
      const response = await axios.post("/checkin", associate);
      const { data: responseData } = response;

      // Store the token in local storage and state
      localStorage.setItem("token", responseData.token);

      // Decode the token to access user data
      const decodedToken = jwt_decode(responseData.token);
      console.log(decodedToken);
      dispatch(userLogin(decodedToken.user));
      Swal.fire({
        title: "Do you want to checkintoday ?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          loginToday(decodedToken.user.id);
          if (decodedToken.user.isAdmin) {
            console.log(decodedToken.user.isAdmin);
            navigate(`/admin/${decodedToken.user.id}`);
          } else {
            navigate(`/associate/${decodedToken.user.id}`);
          }
        } else if (result.isDenied) {
          toast.info("Select the dates you want to check in later", {
            position: "top-center",
          });
          if (decodedToken.user.isAdmin) {
            navigate(`/admin/${decodedToken.user.id}`);
          } else {
            navigate(`/associate/${decodedToken.user.id}`);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-body">
      <div
        className="container  mt-3  justify-content-center align-items-center "
        style={{ maxWidth: "500px" }}
      >
        <div className="card mb-3" style={{ maxWidth: "500px" }}>
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3 row">
                <label
                  htmlFor="associateId"
                  className="col-sm-4 col-md-3 col-form-label"
                >
                  AssociateId
                </label>
                <div className="col-sm-8 col-md-9">
                  <input
                    type="text"
                    name="associateId"
                    className="form-control"
                    id="associateId"
                    {...register("associateId", {
                      required: "Please enter the Associate Name.",
                    })}
                  />
                  {errors.associateId && (
                    <p className="text-danger">*{errors.associateId.message}</p>
                  )}
                </div>
              </div>

              <div className="mb-3 row">
                <label
                  htmlFor="password"
                  className="col-sm-4 col-md-3 col-form-label"
                >
                  Password
                </label>
                <div className="col-sm-8 col-md-9">
                  <div className="input-group">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      id="password"
                      {...register("password", {
                        required: "Please enter the password.",
                      })}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-danger">*{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="mb-3 text-center">
                <button type="submit" className="btn btn-primary">
                  submit
                </button>
                <div className="col text-end text-decoration-none">
                    <NavLink to="reset-password">Forgot Password?</NavLink>
                  </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
