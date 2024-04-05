import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPasswordScreen() {
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm();

  const sendOTP = async (data) => {
    console.log(data);
    try {
      // Generate OTP and send it to the user's email
      await axios.post("/send-otp", { email: data.email });
      setEmailSent(true);
      toast.success("OTP sent to your email. Please check your inbox.", {
        position: "top-center",
      });
      // reset();
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.", {
        position: "top-center",
      });
    }
  };

  const resetPassword = async (data) => {
    console.log(data);
    try {
      // Validate OTP and update the password in your database
      await axios.post("/reset-password", {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      toast.success(
        "Password reset successfully. You can now log in with your new password.",
        {
          position: "top-center",
        }
      );
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(
        "Failed to reset password. Please check your OTP and try again.",
        {
          position: "top-center",
        }
      );
    }
  };

  return (
    <div className="containerBody">
      <div
        className="container mt-3 justify-content-center align-items-center"
        style={{ maxWidth: "600px" }}
      >
        {!emailSent ? (
          <div className="card mb-3" style={{ maxWidth: "500px" }}>
            <div className="card-body">
              <form onSubmit={handleSubmit(sendOTP)}>
                <div className="mb-3 row">
                  <label
                    htmlFor="email"
                    className="col-sm-4 col-md-3 col-form-label"
                  >
                    Email
                  </label>
                  <div className="col-sm-8 col-md-9">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      {...register("email", {
                        required: "Please enter your email address.",
                      })}
                    />
                    {errors.email && (
                      <p className="text-danger">*{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-3 text-center">
                  <button type="submit" className="btn btn-primary">
                    Send OTP
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="card mb-3" style={{ maxWidth: "700px" }}>
            <div className="card-body">
              <form onSubmit={handleSubmit(resetPassword)}>
                <div className="mb-3 row">
                  <label
                    htmlFor="otp"
                    className="col-sm-4 col-md-3 col-form-label"
                  >
                    OTP
                  </label>
                  <div className="col-sm-8 col-md-9">
                    <input
                      type="numberic"
                      name="otp"
                      className="form-control"
                      id="otp"
                      {...register("otp", {
                        required: "Please enter the OTP sent to your email.",
                      })}
                    />
                    {errors.otp && (
                      <p className="text-danger">*{errors.otp.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-3 row">
                  <label
                    htmlFor="newPassword"
                    className="col-sm-4 col-md-3 col-form-label"
                  >
                    NewPassword
                  </label>
                  <div className="col-sm-8 col-md-9">
                    <input
                      type="password"
                      name="newPassword"
                      className="form-control"
                      id="newPassword"
                      {...register("newPassword", {
                        required: "Please enter your new password.",
                      })}
                    />
                    {errors.newPassword && (
                      <p className="text-danger">
                        *{errors.newPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-3 text-center">
                  <button type="submit" className="btn btn-primary">
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}