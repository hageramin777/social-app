import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useNavigate } from "react-router-dom";

const schema = zod
  .object({
    name: zod
      .string()
      .nonempty("name is required")
      .min(3, "min Length is 3 chars")
      .max(10, "max Length is 10 chars"),

    email: zod
      .string()
      .nonempty("email is required")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "invalid email address"
      ),

    gender: zod.string().nonempty("gender is required"),

    password: zod
      .string()
      .nonempty("password is required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "password should contains at 1 spical , 1 numbur, 1capital char, 1 smal chars & min length is 8 chars"
      ),

    rePassword: zod.string().nonempty("rePassword is required"),

    dateOfBirth: zod.coerce.date().refine((datevalue) => {
      const today = new Date();
      const age = today.getFullYear() - datevalue.getFullYear();
      const monthDiff = today.getMonth() - datevalue.getMonth();
      const dayDiff = today.getDate() - datevalue.getDate();

      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      return actualAge >= 18;
    }, "you must be at least 18 years old"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "password and rePassword do not match",
    path: ["rePassword"],
  });

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState } = form;

  function handleRegister(values) {
  console.log("Sending data:", values);

  setIsLoading(true);
  setApiError(null);

  axios
    .post("https://route-posts.routemisr.com/users/signup", values)
    .then((res) => {
      console.log(res.data);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log("Error response:", err.response?.data);
      console.log("Sent data:", err.config.data);

      setApiError(
        err.response?.data?.message || "حصل خطأ في الاتصال"
      );
      setIsLoading(false);
    });
}
  return (
    <div>
      {apiError && (
        <p className="bg-red-500 text-white font-bold p-2 m-4 rounded-sm">
          {apiError}
        </p>
      )}
    <p className="mt-4 text-center text-2xl font-bold text-black">
  Create your account
</p>
      <form onSubmit={handleSubmit(handleRegister)} className="max-w-md mx-auto my7">
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("name")}
            type="text"
            id="name"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent 
            border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label htmlFor="name" className="absolute text-sm text-body duration-300
            transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
            Full Name
          </label>
          {formState.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.name.message}</p>
          )}
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("email")}
            type="email"
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent 
            border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label htmlFor="email" className="absolute text-sm text-body duration-300
            transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
            Email Address
          </label>
          {formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.email.message}</p>
          )}
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("password")}
            type="password"
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent 
            border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label htmlFor="password" className="absolute text-sm text-body duration-300
            transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
            password
          </label>
          {formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.password.message}</p>
          )}
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("rePassword")}
            type="password"
            id="rePassword"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent 
            border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label htmlFor="rePassword" className="absolute text-sm text-body duration-300
            transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
            enter password
          </label>
          {formState.errors.rePassword && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.rePassword.message}</p>
          )}
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("dateOfBirth")}
            type="date"
            id="dateOfBirth"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent 
            border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label htmlFor="dateOfBirth" className="absolute text-sm text-body duration-300
            transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
            date of birth
          </label>
          {formState.errors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1">{formState.errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex items-center mb-4">
            <input
              {...register("gender")}
              id="male"
              type="radio"
              value="male"
              className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium
              rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle 
              border border-default appearance-none"
            />
            <label htmlFor="male" className="select-none ms-2 text-sm font-medium text-heading">
              Male
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              {...register("gender")}
              id="female"
              type="radio"
              value="female"
              className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
            />
            <label htmlFor="female" className="select-none ms-2 text-sm font-medium text-heading">
              Female
            </label>
          </div>
        </div>
        {formState.errors.gender && (
          <p className="text-red-500 text-sm mt-1 -mt-3">{formState.errors.gender.message}</p>
        )}

        <div>
          <button
            disabled={isLoading}
            type="submit"
            className="inline-flex items-center text-white disabled:bg-amber-950 bg-blue-500 w-full cursor-pointer rounded-lg hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            {isLoading ? "Loading..." : "create account"}
            {!isLoading && (
              <svg className="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m14 0-4 4m4-4-4-4" />
              </svg>
            )}
          </button>
        </div>
      </form>
       <p className="mt-4 text-center text-lg text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-blue-500 hover:underline"
        >
          Sign in
        </button>
      </p>
      {/* Social buttons */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-3 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.15.8 3.87 1.5l2.64-2.55C16.87 3.4 14.7 2.4 12 2.4 6.9 2.4 2.7 6.6 2.7 11.7s4.2 9.3 9.3 9.3c5.37 0 8.93-3.77 8.93-9.08 0-.61-.07-1.08-.15-1.55H12z"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 rounded-lg py-3 text-white font-medium hover:bg-blue-600 transition"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
            </svg>
            Facebook
          </button>
        </div>

    </div>
  );
}
