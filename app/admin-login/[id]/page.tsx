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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

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

      router.push('/admin/${id}');

    } catch (error) {

      console.log(error);

      alert('Invalid Credentials');

    }

  };

  return (

    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-black
        via-zinc-950
        to-violet-950
        flex
        items-center
        justify-center
        p-6
      "
    >

      <form

        onSubmit={handleSubmit}

        className="
          w-full
          max-w-md
          bg-white/5
          border
          border-white/10
          backdrop-blur-xl
          rounded-[35px]
          p-10
          shadow-2xl
        "
      >

        <div className="text-center mb-10">

          <h1
            className="
              text-5xl
              font-black
              bg-gradient-to-r
              from-yellow-300
              via-white
              to-violet-300
              bg-clip-text
              text-transparent
              mb-4
            "
          >
            Admin Login
          </h1>

          <p
            className="
              text-gray-400
              text-lg
            "
          >
            EventFlow Organizer Portal
          </p>

        </div>

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
            rounded-[20px]
            bg-white/5
            border
            border-white/10
            backdrop-blur-xl
            text-white
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-violet-500
          "
        />

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
            rounded-[20px]
            bg-white/5
            border
            border-white/10
            backdrop-blur-xl
            text-white
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-violet-500
          "
        />

        <button

          type="submit"

          className="
            w-full
            bg-violet-500
            hover:bg-violet-600
            text-white
            font-bold
            py-4
            rounded-[20px]
            text-lg
            transition-all
            shadow-lg
            shadow-violet-500/30
          "
        >
          Login
        </button>

      </form>

    </main>

  );

}



