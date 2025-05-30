"use client";
import { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Api } from "@/types/api";
import { redirect } from "next/navigation";
import UseApi from "@/hooks/UseApi";
import {UserSignup} from "@/types/auth-types";
import {useState} from "react";

interface IFormInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function Signup() {
  const { register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const { signup } = UseApi();
  const [ errorMessage, setErrorMessage ] = useState('');
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    const result: Api = await signup({email: data.email, password: data.password, firstName: data.firstName, lastName: data.lastName} as UserSignup);
    if (result?.status === 201) {
      redirect("/login");
    }
    console.log(result);
    setErrorMessage("Account Already Exists");
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex flex-row justify-center">
          <img
            alt="YASMA"
            src="/parrot-logo.png"
            className="h-10"
          />
          <span className="text-4xl font-bold tracking-tight ml-4"  >
           YASMA
          </span>
        </div>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">
          Create account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {errorMessage && (
            <span className="text-sm text-red-600">{errorMessage}</span>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm/6 font-medium  ${errors.email ? 'text-red-900' : 'text-grey-300'}`}>
              Email Address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", { required: true, min: 8, max: 64 })}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 sm:text-sm/6  ${errors.email ? 'outline-red-900 focus:outline-red-900' : 'outline-gray-300 focus:outline-indigo-600'} placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2  sm:text-sm/6\`}`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={`block text-sm/6 font-medium ${errors.email ? 'text-red-900' : 'text-grey-300'}`}>
              First Name
            </label>
            <div className="mt-2">
              <input
                id="firstName"
                type="text"
                autoComplete="firstName"
                {...register("firstName", { required: true, min: 3, max: 64 })}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 sm:text-sm/6  ${errors.email ? 'outline-red-900 focus:outline-red-900' : 'outline-gray-300 focus:outline-indigo-600'} placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2  sm:text-sm/6\`}`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={`block text-sm/6 font-medium ${errors.email ? 'text-red-900' : 'text-grey-300'}`}>
              Last Name
            </label>
            <div className="mt-2">
              <input
                id="lastName"
                type="text"
                autoComplete="lastName"
                {...register("lastName", { required: true, min: 3, max: 64 })}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 sm:text-sm/6  ${errors.email ? 'outline-red-900 focus:outline-red-900' : 'outline-gray-300 focus:outline-indigo-600'} placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2  sm:text-sm/6\`}`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className={`block text-sm/6 font-medium ${errors.email ? 'text-red-900' : 'text-grey-300'}`}>
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                {...register("password", { required: true, min: 8, max: 64 })}
                autoComplete="current-password"
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 sm:text-sm/6  ${errors.email ? 'outline-red-900 focus:outline-red-900' : 'outline-gray-300 focus:outline-indigo-600'} placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2  sm:text-sm/6\`}`}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
