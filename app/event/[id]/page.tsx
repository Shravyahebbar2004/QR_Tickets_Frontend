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



      {/* BANNER */}
      <div className="w-full max-w-6xl mx-auto pt-8 px-5">
        {event.banner_url ? (
          <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-zinc-950">
            <img
              src={event.banner_url?.startsWith('http') ? event.banner_url : `${process.env.NEXT_PUBLIC_API_URL}/${event.banner_url?.replace(/\\/g, '/')}`}
              alt={event.title}
              className="w-full h-auto max-h-[80vh] object-contain mx-auto block"
            />
          </div>
        ) : (
          <div className="w-full h-64 md:h-96 rounded-[32px] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-500 flex items-center justify-center">
            <h1 className="text-4xl font-black text-white">{event.title}</h1>
          </div>
        )}
      </div>

      {/* DETAILS & CTA */}
      <div className="max-w-7xl mx-auto px-5 pt-10 pb-16">
        {/* TITLE & TAGLINE BELOW BANNER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-cyan-300 via-white to-violet-300 text-transparent bg-clip-text">
            {event.title}
          </h1>
          {event.tagline && (
            <p className="text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {event.tagline}
            </p>
          )}
        </div>

        {/* MAIN CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12 sm:mb-16 w-full">
          {!isExpired && (
            <Link href={`/register/${event.event_id}`} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-violet-500 hover:bg-violet-600 px-8 sm:px-10 py-4 rounded-2xl sm:rounded-3xl text-xl sm:text-2xl font-black shadow-2xl shadow-violet-500/40 transition hover:-translate-y-1">
                Register Now
              </button>
            </Link>
          )}
          {!isExpired && (
            <Link href={`/my-ticket/${event.event_id}`} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 px-8 sm:px-10 py-4 rounded-2xl sm:rounded-3xl text-xl sm:text-2xl font-black shadow-2xl shadow-cyan-500/40 transition hover:-translate-y-1">
                View My Ticket
              </button>
            </Link>
          )}
        </div>

        {/* INFO */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12">
          <a
            href={event.venue_map_url || "https://maps.app.goo.gl/V38WwSw8WjvyPFfU9?g_st=ac"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 px-5 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-3xl flex items-center gap-4 backdrop-blur-xl hover:scale-105 transition shadow-lg shadow-black/50 cursor-pointer group w-full sm:w-auto"
          >
            <MapPin size={28} className="text-cyan-300 group-hover:scale-110 transition flex-shrink-0" />
            <div>
              <p className="text-lg sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition">
                {event.venue}
              </p>
              <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                <span>📍 View Location on Google Maps</span> ↗
              </p>
            </div>
          </a>
          <div className="bg-white/5 border border-white/10 px-5 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-3xl flex items-center gap-4 backdrop-blur-xl hover:scale-105 transition shadow-lg shadow-black/50 w-full sm:w-auto">
            <CalendarDays size={28} className="text-violet-300 flex-shrink-0" />
            <p className="text-lg sm:text-2xl font-bold text-yellow-300">
              {new Date(event.event_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' })} • {new Date(event.event_date).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true })}
            </p>
          </div>
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

        {/* FOOTER */}
        <footer className="relative z-10 border-t border-white/10 pt-10 pb-5 mt-20 text-center text-gray-500">
          <p className="mb-4">© 2026 EventFlow Platform. All Rights Reserved.</p>
          <p className="text-gray-400">For more details, contact <strong className="text-white">Shravya Hebbar</strong> at <a href="mailto:rotaractyelahanka.events@gmail.com" className="text-cyan-400 hover:underline font-medium">rotaractyelahanka.events@gmail.com</a> or call <span className="text-cyan-400 font-medium">9611444945</span></p>
        </footer>

      </div>

    </main>

  );

}