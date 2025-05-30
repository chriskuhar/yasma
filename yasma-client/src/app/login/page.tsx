'use client'
import { Api } from '@/types/api'
import UseApi from '@/hooks/UseApi';
import { useForm, SubmitHandler } from 'react-hook-form';

interface IFormInput {
  email: string
  password: string
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()
  const { googleAuthenticate } = UseApi();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const result : Api = await googleAuthenticate(data.email, data.password)

    if(result.data) {
      window.location.href = result?.data?.url;
    }
    console.log(result)
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex flex-row justify-center">
          <img alt="YASMA" src="/parrot-logo.png" className="h-10" />
          <span className="text-4xl font-bold tracking-tight ml-4">YASMA</span>
        </div>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm/6 font-medium ${errors.email ? 'text-red-900' : 'text-grey-300'}`}>
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", { required: true, min: 8, max: 64 })}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 ${errors.email ? 'outline-red-900':'outline-gray-300'} placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 ${errors.email ? 'focus:outline-red-900':'focus:outline-indigo-600'} sm:text-sm/6`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className={`block text-sm/6 font-medium ${errors.password ? 'text-red-900' : 'text-grey-300'}`}>
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                {...register("password", { required: true, min: 8, max: 64 })}
                autoComplete="current-password"
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 ${errors.password ? 'outline-red-900':'outline-gray-300'} placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 ${errors.email ? 'focus:outline-red-900':'focus:outline-indigo-600'} sm:text-sm/6`}
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
