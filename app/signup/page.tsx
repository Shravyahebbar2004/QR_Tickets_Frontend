'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignupPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({

    full_name: '',
    email: '',
    password: ''

  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (

    e: React.ChangeEvent<HTMLInputElement>

  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });

  };

  const handleSubmit = async (

    e: React.FormEvent

  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await axios.post(

        `${process.env.NEXT_PUBLIC_API_URL}/api/signup`,

        formData

      );

      console.log(response.data);

      alert('Account Created Successfully ✅');

      router.push('/login');

    } catch (error) {

      console.log(error);

      alert('Signup Failed');

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-black
      text-white
      p-6
    ">

      <form

        onSubmit={handleSubmit}

        className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-10
          w-full
          max-w-md
        "
      >

        <h1 className="
          text-4xl
          font-black
          mb-8
        ">

          Create Account

        </h1>

        <input

          type="text"

          name="full_name"

          placeholder="Full Name"

          value={formData.full_name}

          onChange={handleChange}

          required

          className="
            w-full
            p-4
            rounded-xl
            bg-black/30
            mb-4
          "
        />

        <input

          type="email"

          name="email"

          placeholder="Email"

          value={formData.email}

          onChange={handleChange}

          required

          className="
            w-full
            p-4
            rounded-xl
            bg-black/30
            mb-4
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
            rounded-xl
            bg-black/30
            mb-6
          "
        />

        <button

          type="submit"

          disabled={loading}

          className="
            w-full
            bg-violet-500
            py-4
            rounded-xl
            font-bold
          "
        >

          {

            loading

              ? 'Creating...'

              : 'Sign Up'

          }

        </button>

      </form>

    </main>

  );

}