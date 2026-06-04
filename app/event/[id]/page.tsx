'use client';

import { use, useEffect, useState } from 'react';

import axios from 'axios';

import Link from 'next/link';

import {

  CalendarDays,
  MapPin,
  ArrowRight,
  Users,
  ShieldCheck,
  ScanLine

} from 'lucide-react';

import { motion } from 'framer-motion';


export default function EventPage({

  params

}: {

  params: Promise<{

    id: string

  }>

}) {

  const { id } = use(params);

  const [event, setEvent] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [timeLeft, setTimeLeft] =
    useState({

    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0

  });

  // =====================================
  // FETCH EVENT
  // =====================================

  useEffect(() => {

    fetchEvent();

  }, []);

  const fetchEvent = async () => {

    try {

      const response = await axios.get(

        `${process.env.NEXT_PUBLIC_API_URL}/api/event/${id}`

      );

      setEvent(response.data.event);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  // =====================================
  // COUNTDOWN TIMER
  // =====================================

  useEffect(() => {

  if (!event) return;

  const targetDate = new Date(
    event.event_date
  );

  const interval = setInterval(() => {

    const now = new Date().getTime();

    const distance =
      targetDate.getTime() - now;

    const days = Math.floor(

      distance /

      (1000 * 60 * 60 * 24)

    );

    const hours = Math.floor(

      (

        distance %

        (1000 * 60 * 60 * 24)

      ) /

      (1000 * 60 * 60)

    );

    const minutes = Math.floor(

      (

        distance %

        (1000 * 60 * 60)

      ) /

      (1000 * 60)

    );

    const seconds = Math.floor(

      (

        distance %

        (1000 * 60)

      ) /

      1000

    );

    setTimeLeft({

      days,
      hours,
      minutes,
      seconds

    });

  }, 1000);

  return () => clearInterval(interval);

}, [event]);


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="
        min-h-screen
        bg-black
        flex
        items-center
        justify-center
        text-white
        text-2xl
      ">

        Loading Event...

      </div>

    );

  }

  // =====================================
  // EVENT NOT FOUND
  // =====================================

  if (!event) {

    return (

      <div className="
        min-h-screen
        bg-black
        flex
        items-center
        justify-center
        text-red-500
        text-3xl
        font-bold
      ">

        Event Not Found

      </div>

    );

  }

  return (

    <main className="
      min-h-screen
      bg-gradient-to-br
      from-black
      via-zinc-950
      to-violet-950
      text-white
      overflow-hidden
    ">

      {/* HERO */}

      <div className="
        relative
        h-[70vh]
        overflow-hidden
      ">

        {

          event.banner_url ? (

            <img

              src={`${process.env.NEXT_PUBLIC_API_URL}/${event.banner_url}`}

              alt="Banner"

              className="
                w-full
                h-full
                object-cover
              "

            />

          ) : (

            <div className="
              w-full
              h-full
              bg-gradient-to-br
              from-violet-600
              via-fuchsia-500
              to-cyan-500
            "></div>

          )

        }

        {/* OVERLAY */}

        <div className="
          absolute
          inset-0
          bg-black/60
        "></div>

        {/* CONTENT */}

        <div className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          text-center
          px-5
        ">

          <div>

            <div className="
              inline-flex
              items-center
              gap-2
              bg-white/5
border-white/10
backdrop-blur-xl
hover:scale-105
transition              border
              border-white/10
              px-5
              py-2
              rounded-full
              backdrop-blur-xl
              mb-8
            ">

              <p className="
                text-sm
                text-gray-300
              ">

                {

                  event.category ||

                  'Event'

                }

              </p>

            </div>

            <h1 className="
              text-6xl
              md:text-8xl
              font-black
              mb-6
            ">

              {

                event.title

              }

            </h1>

            <p className="
              text-2xl
              text-gray-300
              max-w-3xl
              mx-auto
            ">

              {

                event.tagline

              }

            </p>

          </div>

        </div>

      </div>

      {/* DETAILS */}

      <div className="
        max-w-7xl
        mx-auto
        px-5
        py-24
      ">

        {/* INFO */}

        <div className="
          flex
          flex-wrap
          gap-5
          mb-12
        ">

          <div className="
            bg-white/5
border-white/10
backdrop-blur-xl
hover:scale-105
transition            border
            border-white/10
            px-6
            py-4
            rounded-2xl
            flex
            items-center
            gap-3
          ">

            <MapPin
              className="text-cyan-300"
            />

            <p>

              {

                event.venue

              }

            </p>

          </div>

          <div className="
            bg-white/5
border-white/10
backdrop-blur-xl
hover:scale-105
transition            border
            border-white/10
            px-6
            py-4
            rounded-2xl
            flex
            items-center
            gap-3
          ">

            <CalendarDays
              className="text-violet-300"
            />

            <p>

              {

                new Date(

                  event.event_date

                ).toLocaleString()

              }

            </p>

          </div>

        </div>
{/* COUNTDOWN */}

<div className="
  mt-16
  mb-20
  grid
  grid-cols-2
  md:grid-cols-4
  gap-6
  max-w-5xl
  mx-auto
">

  <div className="
    bg-white/5
    border
    border-white/10
    backdrop-blur-xl
    p-6
    rounded-3xl
    text-center
  ">

    <h2 className="
      text-5xl
      font-black
      mb-2
    ">
      {timeLeft.days}
    </h2>

    <p className="
      text-lg
      text-gray-300
    ">
      Days
    </p>

  </div>

  <div className="
    bg-white/5
    border
    border-white/10
    backdrop-blur-xl
    p-6
    rounded-3xl
    text-center
  ">

    <h2 className="
      text-5xl
      font-black
      mb-2
    ">
      {timeLeft.hours}
    </h2>

    <p className="
      text-lg
      text-gray-300
    ">
      Hours
    </p>

  </div>

  <div className="
    bg-white/5
    border
    border-white/10
    backdrop-blur-xl
    p-6
    rounded-3xl
    text-center
  ">

    <h2 className="
      text-5xl
      font-black
      mb-2
    ">
      {timeLeft.minutes}
    </h2>

    <p className="
      text-lg
      text-gray-300
    ">
      Minutes
    </p>

  </div>

  <div className="
    bg-white/5
    border
    border-white/10
    backdrop-blur-xl
    p-6
    rounded-3xl
    text-center
  ">

    <h2 className="
      text-5xl
      font-black
      mb-2
    ">
      {timeLeft.seconds}
    </h2>

    <p className="
      text-lg
      text-gray-300
    ">
      Seconds
    </p>

  </div>

</div>

{/* ABOUT EVENT */}

<div className="
  bg-white/5
  border
  border-white/10
  rounded-[40px]
  p-10
  mb-16
  backdrop-blur-xl
">

  <h2 className="
    text-4xl
    font-bold
    mb-8
  ">
    About Event
  </h2>

  <p className="
    text-xl
    text-gray-400
    leading-loose
  ">

    {event.description}

  </p>

</div>

        {/* HIGHLIGHTS */}

        <div className="
          grid
          md:grid-cols-3
          gap-6
          mb-20
        ">

          {/* CARD 1 */}

          <motion.div

            whileHover={{

              scale: 1.03

            }}

            className="
              bg-white/5
              border
              border-white/10
              rounded-[30px]
              p-8
              backdrop-blur-xl
              text-center
            "

          >

            <Users
              size={45}
              className="
                mx-auto
                mb-5
                text-cyan-300
              "
            />

            <h3 className="
              text-4xl
              font-black
              mb-3
            ">

              {

                event.feature1_value ||

                '5K+'

              }

            </h3>

            <p className="
              text-gray-400
              text-lg
            ">

              {

                event.feature1_title ||

                'Attendees'

              }

            </p>

          </motion.div>

          {/* CARD 2 */}

          <motion.div

            whileHover={{

              scale: 1.03

            }}

            className="
              bg-white/5
              border
              border-white/10
              rounded-[30px]
              p-8
              backdrop-blur-xl
              text-center
            "

          >

            <ShieldCheck
              size={45}
              className="
                mx-auto
                mb-5
                text-violet-300
              "
            />

            <h3 className="
              text-4xl
              font-black
              mb-3
            ">

              {

                event.feature2_value ||

                'QR'

              }

            </h3>

            <p className="
              text-gray-400
              text-lg
            ">

              {

                event.feature2_title ||

                'Secure Access'

              }

            </p>

          </motion.div>

          {/* CARD 3 */}

          <motion.div

            whileHover={{

              scale: 1.03

            }}

            className="
              bg-white/5
              border
              border-white/10
              rounded-[30px]
              p-8
              backdrop-blur-xl
              text-center
            "

          >

            <ScanLine
              size={45}
              className="
                mx-auto
                mb-5
                text-pink-300
              "
            />

            <h3 className="
              text-4xl
              font-black
              mb-3
            ">

              {

                event.feature3_value ||

                'Live'

              }

            </h3>

            <p className="
              text-gray-400
              text-lg
            ">

              {

                event.feature3_title ||

                'Experience'

              }

            </p>

          </motion.div>

        </div>

        {/* CTA */}

        <div className="
          text-center
        ">

         <div className="
  flex
  flex-wrap
  justify-center
  gap-5
">

  {/* REGISTER */}

  <Link
    href={`/register/${event.event_id}`}
  >

    <button className="
      bg-violet-500
      hover:bg-violet-600
      px-8
      py-4
      rounded-2xl
      text-xl
      font-bold
      transition
    ">

      Register Now

    </button>

  </Link>

  {/* MY TICKET */}

  <Link
    href={`/my-ticket/${event.event_id}`}
  >

    <button className="
      bg-cyan-500
      hover:bg-cyan-600
      px-8
      py-4
      rounded-2xl
      text-xl
      font-bold
      transition
    ">

      My Ticket

    </button>

  </Link>

  {/* ADMIN */}

  <Link
    href={`/admin-login/${event.event_id}`}
  >

    <button className="
      bg-yellow-500
      hover:bg-yellow-600
      px-8
      py-4
      rounded-2xl
      text-xl
      font-bold
      transition
    ">

      Admin Dashboard

    </button>

  </Link>

  {/* SCANNER */}

  <Link
    href={`/scanner-login/${event.event_id}`}
  >

    <button className="
      bg-green-500
      hover:bg-green-600
      px-8
      py-4
      rounded-2xl
      text-xl
      font-bold
      transition
    ">

      Scanner

    </button>

  </Link>

</div>

        </div>

      </div>

    </main>

  );

}