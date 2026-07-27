import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const schema = zod
  .object({
    password: zod.string().nonempty("Current password required"),
    newPassword: zod
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "It must contain a capital letter, a lowercase letter, a number, and a special symbol, and it must be at least 8 characters long."
      )
      .nonempty("New password required"),
    rePassword: zod.string().nonempty("Confirm new password required"),
  })
  .refine((data) => data.newPassword === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export default function ChangePassword() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
      rePassword: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState } = form;

  function handleChangePassword(values) {
    setIsLoading(true);
    setApiError(null);
    setSuccess(false);
    axios
      .patch(
        "https://route-posts.routemisr.com/users/change-password",
        {
          password: values.password,
          newPassword: values.newPassword,
        },
        { headers: { token: localStorage.getItem("token") } }
      )
      .then((res) => {
        setIsLoading(false);
        setSuccess(true);
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        setTimeout(() => navigate("/profile"), 1500);
      })
      .catch((err) => {
        setApiError(err.response?.data?.message || "An error occurred, please try again.");
        setIsLoading(false);
      });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Change Password        </h1>

        {apiError && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded-md mb-4">
            {apiError}
          </p>
        )}

        {success && (
          <p className="bg-green-100 text-green-600 text-sm p-2 rounded-md mb-4">
            Password changed successfully
          </p>
        )}

        <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              {...register("newPassword")}
              type="password"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formState.errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              {...register("rePassword")}
              type="password"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formState.errors.rePassword && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.rePassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}