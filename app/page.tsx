
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


import axios from 'axios';
import {

  MapPin,
  ArrowRight,

} from 'lucide-react';

import {
  Menu,
  X,
  Ticket,
  QrCode,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Users,
  CalendarDays,
  ScanLine
} from 'lucide-react';



import { motion } from 'framer-motion';

export default function HomePage() {

  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState({

    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0

  });

  const [events, setEvents] =
  useState<any[]>([]);

const [loading, setLoading] =
  useState(true);

  // FETCH EVENTS //

  useEffect(() => {

  fetchEvents();

}, []);

const fetchEvents = async () => {

  try {

    const response = await axios.get(

       `${process.env.NEXT_PUBLIC_API_URL}/api/events`

    );

    setEvents(response.data.events);

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

    const targetDate = new Date(
      '2026-06-13T18:00:00'
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
        )
        /
        (1000 * 60 * 60)
      );

      const minutes = Math.floor(
        (
          distance %
          (1000 * 60 * 60)
        )
        /
        (1000 * 60)
      );

      const seconds = Math.floor(
        (
          distance %
          (1000 * 60)
        )
        /
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

  }, []);

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

      {/* =====================================
          ANIMATED BACKGROUND
      ===================================== */}

      <div className="
        absolute
        inset-0
        overflow-hidden
      ">

        <div className="
          absolute
          top-[-200px]
          left-[-200px]
          w-[600px]
          h-[600px]
          bg-violet-500/20
          blur-[180px]
          rounded-full
          animate-pulse
        "></div>

        <div className="
          absolute
          bottom-[-200px]
          right-[-200px]
          w-[600px]
          h-[600px]
          bg-cyan-500/20
          blur-[180px]
          rounded-full
          animate-pulse
        "></div>

        <div className="
          absolute
          top-[35%]
          left-[40%]
          w-[450px]
          h-[450px]
          bg-fuchsia-500/10
          blur-[180px]
          rounded-full
        "></div>

      </div>

      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="
        fixed
        top-0
        left-0
        right-0
        z-50
        border-b
        border-white/10
        bg-black/20
        backdrop-blur-2xl
      ">

        <div className="
          max-w-7xl
          mx-auto
          px-5
          md:px-10
          py-5
          flex
          items-center
          justify-between
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-12
              h-12
              rounded-2xl
              bg-gradient-to-r
              from-violet-500
              to-cyan-400
              flex
              items-center
              justify-center
              shadow-lg
              shadow-violet-500/30
            ">

              <Sparkles className="text-white" />

            </div>

            <div>

              <h1 className="
                text-2xl
                md:text-3xl
                font-black
                bg-gradient-to-r
                from-cyan-300
                to-violet-400
                text-transparent
                bg-clip-text
              ">
                EventFlow
              </h1>

              <p className="
                text-xs
                text-gray-400
              ">
                Smart Event Platform
              </p>

            </div>

          </div>

          {/* MOBILE BUTTON */}

          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="
              md:hidden
              text-white
            "
          >
            {
              menuOpen
                ? <X size={32} />
                : <Menu size={32} />
            }
          </button>

          {/* DESKTOP MENU */}

          <div className="
            hidden
            md:flex
            items-center
            gap-4
          ">

            <Link href="/create-event">

              <button className="
                bg-violet-500
                hover:bg-violet-600
                px-6
                py-3
                rounded-2xl
                font-bold
                transition
                shadow-lg
                shadow-violet-500/30
                hover:scale-105
              ">
                Register Your Event
              </button>

            </Link>

          </div>

        </div>

      </nav>

      {/* MOBILE MENU */}

      {
        menuOpen && (

          <div className="
            fixed
            inset-0
            z-50
            bg-black/90
            backdrop-blur-2xl
            flex
            flex-col
            items-center
            justify-center
            gap-10
          ">

            <Link href="/create-event">

              <button
                onClick={() => setMenuOpen(false)}
                className="
                  text-4xl
                  font-black
                  text-cyan-300
                "
              >
                Register Your Event
              </button>

            </Link>

          </div>

        )
      }

      {/* HERO SECTION */}

      <section className="
        relative
        z-10
        min-h-screen
        flex
        items-center
        justify-center
        px-5
        pt-32
      ">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="
            max-w-7xl
            mx-auto
            text-center
          "
        >

          <div className="
            inline-flex
            items-center
            gap-3
            bg-white/5
border-white/10
backdrop-blur-xl
hover:scale-105
transition            border
            border-white/10
            px-6
            py-3
            rounded-full
            mb-8
            backdrop-blur-xl
          ">

            <Sparkles
              className="text-cyan-300"
              size={18}
            />

            <p className="
              text-sm
              md:text-base
              text-gray-300
            ">
              Smart Registrations • QR Access • Live Analytics
            </p>

          </div>

          <h1 className="
            text-6xl
            sm:text-7xl
            md:text-8xl
            font-black
            leading-tight
            mb-8
          ">

            Build Modern

            <span className="
              bg-gradient-to-r
              from-cyan-300
              to-violet-500
              text-transparent
              bg-clip-text
            ">
              {' '}Event Experiences
            </span>

          </h1>

          <p className="
            max-w-4xl
            mx-auto
            text-lg
            md:text-2xl
            text-gray-300
            leading-relaxed
            mb-12
          ">
            EventFlow helps organizers manage
            registrations, QR ticketing,
            attendee scanning, analytics,
            and secure event access with a
            premium modern platform.
          </p>

          {/* CTA */}

          <div className="
            flex
            flex-col
            md:flex-row
            justify-center
            gap-5
            mb-20
          ">

            <Link href="/create-event">

              <button className="
                bg-violet-500
                hover:bg-violet-600
                px-10
                py-5
                rounded-2xl
                text-lg
                md:text-xl
                font-bold
                transition
                shadow-2xl
                shadow-violet-500/30
                hover:scale-105
                w-full
                md:w-auto
              ">
                Register Your Event
              </button>

            </Link>

          </div>

          {/* COUNTDOWN */}

          <div className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-5
            max-w-5xl
            mx-auto
          ">

            {
              [
                {
                  label: 'Days',
                  value: timeLeft.days
                },
                {
                  label: 'Hours',
                  value: timeLeft.hours
                },
                {
                  label: 'Minutes',
                  value: timeLeft.minutes
                },
                {
                  label: 'Seconds',
                  value: timeLeft.seconds
                }
              ].map((item) => (

                <div
                  key={item.label}
                  className="
                    bg-white/5
                    backdrop-blur-2xl
                    border
                    border-white/10
                    rounded-3xl
                    p-6
                  "
                >

                  <h2 className="
                    text-4xl
                    md:text-5xl
                    font-black
                    text-cyan-300
                  ">
                    {item.value}
                  </h2>

                  <p className="
                    text-gray-400
                    mt-3
                  ">
                    {item.label}
                  </p>

                </div>

              ))
            }

          </div>

        </motion.div>

      </section>

      {/* FEATURES */}

      <section className="
        relative
        z-10
        px-5
        py-24
      ">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <h2 className="
              text-5xl
              md:text-6xl
              font-black
              mb-6
            ">
              Platform Features
            </h2>

            <p className="
              text-gray-400
              text-xl
              max-w-3xl
              mx-auto
            ">
              Everything needed to run
              professional events efficiently.
            </p>

          </div>

          <div className="
            grid
            md:grid-cols-2
            lg:grid-cols-4
            gap-8
          ">

            {
              [
                {
                  icon: Ticket,
                  title: 'Smart Tickets',
                  desc: 'Generate secure QR event passes instantly.',
                  color: 'text-cyan-300'
                },
                {
                  icon: ScanLine,
                  title: 'QR Scanner',
                  desc: 'Fast live entry scanning with validation.',
                  color: 'text-violet-400'
                },
                {
                  icon: ShieldCheck,
                  title: 'Secure Access',
                  desc: 'Encrypted QR verification and JWT security.',
                  color: 'text-green-400'
                },
                {
                  icon: BarChart3,
                  title: 'Analytics',
                  desc: 'Track registrations and attendance live.',
                  color: 'text-yellow-300'
                }
              ].map((feature, index) => (

                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className="
                    bg-white/5
                    backdrop-blur-2xl
                    border
                    border-white/10
                    rounded-[32px]
                    p-8
                    shadow-2xl
                  "
                >

                  <feature.icon
                    size={50}
                    className={`${feature.color} mb-6`}
                  />

                  <h3 className="
                    text-2xl
                    font-bold
                    mb-4
                  ">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400">
                    {feature.desc}
                  </p>

                </motion.div>

              ))
            }

          </div>

        </div>

      </section>

      {/* STATS */}

      <section className="
        relative
        z-10
        px-5
        py-24
      ">

        <div className="
          max-w-6xl
          mx-auto
          grid
          md:grid-cols-4
          gap-8
        ">

          {
            [
              {
                label: 'Registrations',
                value: '10K+'
              },
              {
                label: 'Events Managed',
                value: '250+'
              },
              {
                label: 'QR Scans',
                value: '50K+'
              },
              {
                label: 'Organizers',
                value: '500+'
              }
            ].map((item, index) => (

              <div
                key={index}
                className="
                  bg-white/5
                  backdrop-blur-2xl
                  border
                  border-white/10
                  rounded-3xl
                  p-8
                  text-center
                "
              >

                <h2 className="
                  text-5xl
                  font-black
                  bg-gradient-to-r
                  from-cyan-300
                  to-violet-500
                  text-transparent
                  bg-clip-text
                  mb-4
                ">
                  {item.value}
                </h2>

                <p className="text-gray-400">
                  {item.label}
                </p>

              </div>

            ))
          }

        </div>

      </section>

      {/* WHY CHOOSE */}

      <section className="
        relative
        z-10
        px-5
        py-24
      ">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-20">

            <h2 className="
              text-5xl
              md:text-6xl
              font-black
              mb-6
            ">
              Why Choose EventFlow
            </h2>

            <p className="
              text-gray-400
              text-xl
              max-w-3xl
              mx-auto
            ">
              Designed for modern organizers,
              universities, festivals,
              conferences and communities.
            </p>

          </div>

          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">

            {
              [
                {
                  icon: Users,
                  title: 'Easy Management',
                  desc: 'Manage attendees, approvals and tickets easily.'
                },
                {
                  icon: CalendarDays,
                  title: 'Multi Event Support',
                  desc: 'Host workshops, fests, concerts and conferences.'
                },
                {
                  icon: QrCode,
                  title: 'Instant QR Access',
                  desc: 'Secure real-time QR validation for entry.'
                }
              ].map((item, index) => (

                <div
                  key={index}
                  className="
                    bg-white/5
                    backdrop-blur-2xl
                    border
                    border-white/10
                    rounded-[32px]
                    p-8
                  "
                >

                  <item.icon
                    className="
                      text-cyan-300
                      mb-6
                    "
                    size={48}
                  />

                  <h3 className="
                    text-3xl
                    font-bold
                    mb-4
                  ">
                    {item.title}
                  </h3>

                  <p className="text-gray-400">
                    {item.desc}
                  </p>

                </div>

              ))
            }

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="
        relative
        z-10
        px-5
        py-28
      ">

        <div className="
          max-w-5xl
          mx-auto
          text-center
          bg-white/5
          backdrop-blur-2xl
          border
          border-white/10
          rounded-[40px]
          p-10
          md:p-16
        ">

          <h2 className="
            text-5xl
            md:text-6xl
            font-black
            mb-8
          ">
            Ready To Launch
            Your Event?
          </h2>

          <p className="
            text-gray-400
            text-xl
            max-w-3xl
            mx-auto
            mb-12
          ">
            Start managing registrations,
            QR ticketing and live event access
            professionally with EventFlow.
          </p>

          <Link href="/create-event">

            <button className="
              bg-violet-500
              hover:bg-violet-600
              px-12
              py-5
              rounded-2xl
              text-xl
              font-bold
              transition
              shadow-2xl
              shadow-violet-500/30
              hover:scale-105
            ">
              Get Started
            </button>

          </Link>

        </div>

      </section>

      {/* ===================================== */}
{/* LIVE EVENTS */}
{/* ===================================== */}

<section className="
  px-6
  md:px-20
  py-24
">

  <h2 className="
    text-5xl
    font-black
    mb-4
  ">

    Live Events

  </h2>

  <p className="
    text-gray-400
    mb-12
    text-xl
  ">

    Discover events created by organizers

  </p>

  {

    loading

    ? (

      <p>

        Loading Events...

      </p>

    )

    : (

      <div className="
        grid
        md:grid-cols-3
        gap-8
      ">

{

 

  events.map((event) => (

    <div

      key={event.event_id}

      className="
        flex
        flex-col
        gap-4
      "

    >

      {/* EVENT CARD */}

      <div

        className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-8
          backdrop-blur-xl
          hover:scale-105
          transition
        "

      >

        <h3 className="
          text-3xl
          font-black
          mb-3
        ">

          {event.title}

        </h3>

        <p className="
          text-gray-400
          mb-4
        ">

          {event.description}

        </p>

        <p className="
          text-violet-300
          mb-2
        ">

          📍 {event.venue}

        </p>

        <p className="
          text-pink-300
        ">

          🎫 {event.category}

        </p>

      </div>

      {/* VIEW EVENT BUTTON */}

      <button

  onClick={() => {

    alert(
      `Event ${event.event_id}`
    );

  }}

  className="
    bg-red-500
    px-12
    py-5
    rounded-2xl
  "

>

  TEST BUTTON

</button>

    </div>

  ))

}
        






  

      </div>

    )

  }

</section>

      {/* FOOTER */}

      <footer className="
        relative
        z-10
        border-t
        border-white/10
        py-10
        text-center
        text-gray-500
      ">

        © 2026 EventFlow Platform.
        All Rights Reserved.

      </footer>

    </main>

  );

}



