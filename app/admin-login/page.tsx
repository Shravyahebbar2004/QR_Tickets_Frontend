'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {

  const router = useRouter();

  const [formData, setFormData] = useState({

    username: '',
    password: ''

  });

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

  // =====================================
  // HANDLE LOGIN
  // =====================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const response = await axios.post(

        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,

        formData

      );

      localStorage.setItem(

        'admin_token',

        response.data.token

      );

      router.push('/admin');

    } catch (error) {

      console.log(error);

      alert('Invalid Credentials');

    }

  };

  // =====================================
  // UI
  // =====================================

  return (

    <div
      className="
        min-h-screen
        bg-black
        flex
        items-center
        justify-center
        p-10
      "
    >

      <form

        onSubmit={handleSubmit}

        className="
          bg-white/10
          backdrop-blur-lg
          border
          border-white/20
          p-10
          rounded-3xl
          w-full
          max-w-md
        "
      >

        <h1
          className="
            text-4xl
            font-bold
            text-yellow-300
            text-center
            mb-10
          "
        >
          Admin Login
        </h1>

        {/* USERNAME */}

        <input

          type="text"

          name="username"

          placeholder="Username"

          value={formData.username}

          onChange={handleChange}

          required

          className="
            w-full
            p-4
            mb-5
            rounded-xl
            bg-white/10
            text-white
            placeholder-gray-400
            border
            border-white/20
            focus:outline-none
            focus:ring-2
            focus:ring-yellow-400
          "
        />

        {/* PASSWORD */}

        <input

          type="password"

          name="password"

          placeholder="Password"

          value={formData.password}

          onChange={handleChange}

          required

          className="
            w-full
            p-4
            mb-8
            rounded-xl
            bg-white/10
            text-white
            placeholder-gray-400
            border
            border-white/20
            focus:outline-none
            focus:ring-2
            focus:ring-yellow-400
          "
        />

        {/* LOGIN BUTTON */}

        <button

          type="submit"

          className="
            w-full
            bg-yellow-400
            hover:bg-yellow-300
            text-black
            font-bold
            py-4
            px-6
            rounded-2xl
            text-lg
            transition
            shadow-lg
            shadow-yellow-500/30
          "
        >
          Login
        </button>

      </form>

    </div>

  );

}