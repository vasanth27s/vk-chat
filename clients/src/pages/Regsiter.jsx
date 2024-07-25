import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser, validUser } from '../apis/auth';
import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs";

const defaultData = {
  firstname: "",
  lastname: "",
  email: "",
  password: ""
};

function Register() {
  const [formData, setFormData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const pageRoute = useNavigate();

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.email.includes("@") && formData.password.length > 6) {
      try {
        const { data } = await registerUser(formData);
        if (data?.token) {
          localStorage.setItem("userToken", data.token);
          toast.success("Successfully Registered 🏆");
          pageRoute("/chats");
        } else {
          toast.error("Registration Failed!");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warning("Provide valid Credentials!");
      setFormData({ ...formData, password: "" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isValid = async () => {
      try {
        const data = await validUser();
        if (data?.user) {
          window.location.href = "/chats";
        }
      } catch (error) {
        console.error("Error validating user:", error);
      }
    };
    isValid();
  }, []);

  return (
    <div className='bg-[#fafafa] w-[100vw] h-[100vh] flex justify-center items-center'>
      <div className='w-[350px] h-[600px] flex flex-col items-center justify-center border border-gray-300 bg-white shadow-lg'>
      <img
  src="https://media.istockphoto.com/id/1314338734/vector/letter-vk-monogram-logo-design.jpg?s=612x612&w=0&k=20&c=_nLlpkc6JxadNX9CaKhOPuLpnbA7yKgQeQKKvRiCM-U="
  alt="vk-chat"
  className='w-[80px] h-[80px] rounded-full mb-6 border-4 border-[#0095f6]'
/>

        <h3 className='text-[25px] font-bold tracking-wider text-[#333] mb-4'>Register</h3>
        <p className='text-gray-500 text-sm mb-4'>Have an account? <Link className='text-[#0095f6] font-semibold' to="/login">Sign in</Link></p>
        <form className='flex flex-col gap-y-4 w-[80%]' onSubmit={handleOnSubmit}>
          <div className='flex gap-x-2 w-[100%]'>
            <input
              onChange={handleOnChange}
              className='bg-[#fafafa] border border-gray-300 h-[40px] px-4 text-[#333] rounded-md w-[49%]'
              type="text"
              name="firstname"
              placeholder='First Name'
              value={formData.firstname}
              required
            />
            <input
              onChange={handleOnChange}
              className='bg-[#fafafa] border border-gray-300 h-[40px] px-4 text-[#333] rounded-md w-[49%]'
              type="text"
              name="lastname"
              placeholder='Last Name'
              value={formData.lastname}
              required
            />
          </div>
          <input
            onChange={handleOnChange}
            className='bg-[#fafafa] border border-gray-300 h-[40px] px-4 text-[#333] rounded-md w-[100%]'
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            required
          />
          <div className='relative'>
            <input
              onChange={handleOnChange}
              className='bg-[#fafafa] border border-gray-300 h-[40px] px-4 text-[#333] rounded-md w-[100%]'
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              required
            />
            {
              !showPass ? (
                <button type='button'>
                  <BsEmojiLaughing onClick={() => setShowPass(!showPass)} className='text-[#333] absolute top-2 right-3 w-[24px] h-[24px]' />
                </button>
              ) : (
                <button type='button'>
                  <BsEmojiExpressionless onClick={() => setShowPass(!showPass)} className='text-[#333] absolute top-2 right-3 w-[24px] h-[24px]' />
                </button>
              )
            }
          </div>
          <button
            className='bg-[#0095f6] text-white h-[40px] rounded-md font-semibold relative'
            type='submit'
          >
            {isLoading ? (
              <div className='flex justify-center items-center'>
                <lottie-player
                  src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json"
                  background="transparent"
                  speed="1"
                  style={{ width: "24px", height: "24px" }}
                  loop
                  autoplay
                ></lottie-player>
              </div>
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
