'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ScannerLoginPage() {

  const router = useRouter();

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');




  // =====================================
  // LOGIN
  // =====================================

  const handleLogin = async (

    e: React.FormEvent

  ) => {

    e.preventDefault();

    try {

      const response = await axios.post(

        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,

        {

          username,

          password

        }

      );



      localStorage.setItem(

        'scanner_token',

        response.data.token

      );



      router.push('/scanner');



    } catch (error) {

      console.log(error);

      alert('Invalid Credentials');

    }

  };




  return (

    <div className="
      min-h-screen
      bg-black
      flex
      items-center
      justify-center
      p-5
    ">

      <form

        onSubmit={handleLogin}

        className="
          bg-white/10
          border
          border-white/10
          backdrop-blur-xl
          p-10
          rounded-3xl
          w-full
          max-w-md
        "

      >

        <h1 className="
          text-5xl
          font-black
          text-yellow-300
          text-center
          mb-10
        ">
          Scanner Login
        </h1>




        {/* USERNAME */}

        <input

          type="text"

          placeholder="Username"

          value={username}

          onChange={(e) =>

            setUsername(e.target.value)

          }

          required

          className="
            w-full
            p-4
            mb-5
            rounded-xl
            bg-black
            border
            border-white/10
            text-white
          "

        />




        {/* PASSWORD */}

        <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e) =>

            setPassword(e.target.value)

          }

          required

          className="
            w-full
            p-4
            mb-8
            rounded-xl
            bg-black
            border
            border-white/10
            text-white
          "

        />




        {/* BUTTON */}

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