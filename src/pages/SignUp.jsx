import React, { useEffect, useState } from "react";
import signUpImg from "../assets/img/sign-up.jpg";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/authContext";

function SignUp() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();

  const [error, setError] = useState("");

  const { loading, signUp } = useAuth();

  const onSubmit = ({ username, email, password }) => {
    signUp(username, email, password).catch((err) => {
      setError(err);
    });
  };

  // RESET ERROR
  useEffect(() => {
    watch(() => {
      if (error != " ") {
        setError("");
      }
    });
  }, [watch]);

  return (
    <div className="flex justify-center">
    {/* IMAGE */}
      <div className="hidden md:block w-1/2">
        <img
          className="h-screen object-cover w-full"
          src={signUpImg}
          alt="guy holding a phone"
        />
      </div>
      {/* Form */}
      <div className="w-[80vw] md:w-1/2 flex flex-col h-screen items-center justify-center">
        <h1 className="text-3xl font-bold mb-5 text-center">Welcome to Chat<span className="text-blue-500">lab</span></h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full max-w-[350px]">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              {...register("username", { required: true })}
              type="text"
              className="grow"
              placeholder="Username"
            />
          </label>
          {errors.username && (
            <span className="text-red-500">Username is required</span>
          )}
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              {...register("email", { required: true })}
              type="email"
              className="grow"
              placeholder="Email"
            />
          </label>
          {errors.email && (
            <span className="text-red-500">Email is required</span>
          )}
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              {...register("password", { required: true, minLength: 6 })}
              type="password"
              placeholder="Password"
              className="grow"
            />
          </label>
          {errors.password?.type === "required" && (
            <span className="text-red-500">Password is required</span>
          )}
          {errors.password?.type === "minLength" && (
            <span className="text-red-500">
              Password should be at least 6 charaters
            </span>
          )}
          {error && <span className="text-red-500">{error}</span>}
          <button disabled={loading} type="submit" className="btn btn-neutral w-full">
          {loading ? (
              <span className="loading loading-spinner text-primary"></span>
            ) : (
              "Sign up"
            )}
          </button>
        </form>
        <p className="text-gray-500 mt-6">
          Have an account?
          <Link to="/">
            <span className="font-bold text-black"> Sign in</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
