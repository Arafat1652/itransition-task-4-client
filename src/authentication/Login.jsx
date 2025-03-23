import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const { register,handleSubmit,formState: { errors },} = useForm()
    const onSubmit = async(data) => {
      const {email, password} = data
      const userInfo = {email, password}
      console.log("email",email,"password", password);

      if(!/@gmail\.com$/.test(email)){
              return toast.error('give a valid email')
          }

          try{

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, userInfo)
            console.log(res.data.user);
            // if(res.data.user) {
            //   toast.success('Login successful')
            //   navigate('/userManagement')
            //   // reset()
            // }
            if (res.data.user) {
                localStorage.setItem('user', JSON.stringify(res.data.user)); // Store user data
                toast.success('Login successful');
                navigate('/userManagement');
            }
    
          }catch(error){
            // toast.error(error.response.data.message);
            if (error.response && error.response.status === 401) {
                toast.error('Unauthorized. Please log in again.');
                navigate('/');
            } else {
                toast.error(error.response?.data?.message || 'An error occurred');
            }
          }
    }

    return (
        <div>
      <div className="w-full max-w-md my-10 p-8 space-y-3 rounded-xl mx-auto bg-base-200">
        <h1 className="text-2xl font-bold text-center">LOGIN</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
             <div className="space-y-1 text-sm">
                            <label htmlFor="username" className="block">Email</label>
                            <input type="email" name="email" id="email" placeholder="Enter Email" className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" {...register("email", { required: true })} />
                            {errors.email && <span className="text-red-400">This field is required</span>}
                        </div>
                        <div className="space-y-1 text-sm relative">
                            <label htmlFor="password" className="block">Password</label>
                            <input 
                            type={showPassword ? "password" : "text"}
                            name="password"
                            id="password"
                            placeholder="Enter Password" className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" {...register("password", { required: true })}  />
                            {errors.password && <span className="text-red-400">This field is required</span>}
                            <span
                          className="absolute top-9 right-4 text-black"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEye></FaEye> : <FaEyeSlash></FaEyeSlash>}
                        </span>
                        </div>
            <button className="block w-full p-3 text-center rounded-sm bg-[#13e5c0]">LOGIN</button>
        </form>
     
        <p className="text-sm text-center sm:px-6">Don not have an account?
            <NavLink to='/register' rel="noopener noreferrer" href="#" className="underline text-blue-700 font-bold"> Register</NavLink>
        </p>
    </div>
    </div>
    );
};

export default Login;