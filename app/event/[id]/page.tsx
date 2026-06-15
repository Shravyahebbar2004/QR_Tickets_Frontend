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
  ScanLine,
  Menu,
  X
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [timeLeft, setTimeLeft] =
    useState({

    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0

  });

  const [isExpired, setIsExpired] = useState(false);

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

    if (distance < 0) {
      setIsExpired(true);
      clearInterval(interval);
      return;
    }

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
      relative
    ">

      {/* HAMBURGER BUTTON */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-6 right-6 z-40 bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/20 backdrop-blur-md transition shadow-xl"
      >
        <Menu size={28} className="text-white" />
      </button>

      {/* SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex justify-end"
          onClick={() => setIsSidebarOpen(false)}
        >
          <motion.div 
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-72 bg-zinc-950 border-l border-white/10 h-full p-6 shadow-2xl flex flex-col relative"
          >
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-6 right-6 bg-white/5 hover:bg-white/10 p-2 rounded-lg transition"
            >
              <X size={24} className="text-gray-400" />
            </button>

            <h3 className="text-2xl font-black text-white mb-10 mt-4">Management</h3>

            <div className="flex flex-col gap-4">
              <Link href={`/admin-login`} onClick={() => setIsSidebarOpen(false)}>
                <button className="w-full bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/50 p-4 rounded-xl text-yellow-400 font-bold transition text-left">
                  Admin Dashboard
                </button>
              </Link>

              <Link href={`/scanner-login`} onClick={() => setIsSidebarOpen(false)}>
                <button className="w-full bg-green-500/20 hover:bg-green-500/40 border border-green-500/50 p-4 rounded-xl text-green-400 font-bold transition text-left">
                  Scanner
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {/* HERO */}

      <div className="
        relative
        h-[70vh]
        overflow-hidden
      ">

        {

          event.banner_url ? (

            <img

              src={event.banner_url?.startsWith('http') ? event.banner_url : `${process.env.NEXT_PUBLIC_API_URL}/${event.banner_url?.replace(/\\/g, '/')}`}

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

            <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
              {event.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* DETAILS */}

      <div className="
        max-w-7xl
        mx-auto
        px-5
        py-16
      ">

        {/* MAIN CTA */}
        <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-16">
          {!isExpired && (
            <Link href={`/register/${event.event_id}`}>
              <button className="bg-violet-500 hover:bg-violet-600 px-10 py-4 rounded-3xl text-2xl font-black shadow-2xl shadow-violet-500/40 transition hover:-translate-y-1">
                Register Now
              </button>
            </Link>
          )}
          {!isExpired && (
            <Link href={`/my-ticket/${event.event_id}`}>
              <button className="bg-cyan-500 hover:bg-cyan-600 px-10 py-4 rounded-3xl text-2xl font-black shadow-2xl shadow-cyan-500/40 transition hover:-translate-y-1">
                View My Ticket
              </button>
            </Link>
          )}
        </div>

        {/* INFO */}
        <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 px-8 py-5 rounded-3xl flex items-center gap-4 backdrop-blur-xl hover:scale-105 transition shadow-lg shadow-black/50">
            <MapPin size={32} className="text-cyan-300" />
            <p className="text-xl md:text-2xl font-bold">
              {event.venue}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 px-8 py-5 rounded-3xl flex items-center gap-4 backdrop-blur-xl hover:scale-105 transition shadow-lg shadow-black/50">
            <CalendarDays size={32} className="text-violet-300" />
            <p className="text-xl md:text-2xl font-bold text-yellow-300">
              {new Date(event.event_date).toLocaleString()}
            </p>
          </div>
        </div>
{/* COUNTDOWN */}

{!isExpired ? (
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
  h-56
  bg-white/5
  border
  border-white/10
  backdrop-blur-xl
  rounded-3xl
  flex
  flex-col
  items-center
  justify-center
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
  h-56
  bg-white/5
  border
  border-white/10
  backdrop-blur-xl
  rounded-3xl
  flex
  flex-col
  items-center
  justify-center
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
  h-56
  bg-white/5
  border
  border-white/10
  backdrop-blur-xl
  rounded-3xl
  flex
  flex-col
  items-center
  justify-center
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
  h-56
  bg-white/5
  border
  border-white/10
  backdrop-blur-xl
  rounded-3xl
  flex
  flex-col
  items-center
  justify-center
  text-center
">

    <h2 className="
      text-5xl
      font-black
      mb-2
    ">
      {timeLeft.seconds}
    </h2>

  </div>

</div>
) : (
  <div className="mt-16 mb-20 max-w-5xl mx-auto bg-red-500/10 border border-red-500/30 p-10 rounded-3xl text-center">
    <h2 className="text-4xl font-black text-red-400 mb-2">Event Concluded</h2>
    <p className="text-xl text-gray-300">This event has already taken place and registrations are closed.</p>
  </div>
)}

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

        {/* Admin & Scanner buttons moved to fixed top-right bar */}

      </div>

    </main>

  );

}