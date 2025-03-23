import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const { register,reset, handleSubmit,formState: { errors },} = useForm()
    const onSubmit = async(data) => {
      const {name, email, password} = data
      const userInfo = {name, email, password}
      console.log("name",name,"email",email,"password", password);

      if(!/@gmail\.com$/.test(email)){
        return toast.error('give a valid email')
    }

      if (!/^.+$/.test(password)) {
        return toast.error('PIN must be exactly 5 digits');
        
      }


      try{

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`, userInfo)
        console.log(res);
        if(res.status === 201) {
          localStorage.setItem('user', JSON.stringify(res.data)); // Store user data
          toast.success('Registration Succesful');
          navigate('/userManagement');
        }

      }catch(error){
        toast.error(error.response.data.message);
      }

    }

    return (
        <div>
      <div className="w-full max-w-md my-10 p-8 space-y-3 rounded-xl mx-auto bg-base-200">
        <h1 className="text-2xl font-bold text-center">REGISTER</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1 text-sm">
                <label htmlFor="username" className="block">Name</label>
                <input type="text" name="username" id="username" placeholder="Enter Name" className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" {...register("name", { required: true })} />
                {errors.name && <span className="text-red-400">This field is required</span>}
            </div>
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
            <button className="block w-full p-3 text-center rounded-sm bg-[#13e5c0]">REGISTER</button>
        </form>
     
        <p className="text-sm text-center sm:px-6">Don not have an account?
            <NavLink to='/' rel="noopener noreferrer" href="#" className="underline text-blue-700 font-bold"> Login</NavLink>
        </p>
    </div>
    </div>
    );
};

export default Register;