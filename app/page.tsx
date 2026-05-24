
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });


  // =====================================
  // COUNTDOWN TIMER
  // =====================================

  useEffect(() => {

    const targetDate = new Date('2026-06-13T18:00:00');

    const interval = setInterval(() => {

      const now = new Date().getTime();

      const distance = targetDate.getTime() - now;

      const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
      );

      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) /
        (1000 * 60)
      );

      const seconds = Math.floor(
        (distance % (1000 * 60)) /
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

    <div className="
      min-h-screen
      bg-black
      text-white
      overflow-hidden
      relative
    ">

      {/* =====================================
          ANIMATED BACKGROUND
      ===================================== */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="
          absolute
          top-[-150px]
          left-[-150px]
          w-[500px]
          h-[500px]
          bg-yellow-500/20
          blur-[150px]
          rounded-full
          animate-pulse
        "></div>


        <div className="
          absolute
          bottom-[-150px]
          right-[-150px]
          w-[500px]
          h-[500px]
          bg-orange-500/20
          blur-[150px]
          rounded-full
          animate-pulse
        "></div>


        <div className="
          absolute
          top-[40%]
          left-[50%]
          w-[400px]
          h-[400px]
          bg-pink-500/10
          blur-[150px]
          rounded-full
        "></div>

      </div>


      {/* =====================================
          FLOATING MUSIC ICONS
      ===================================== */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="
          absolute
          top-20
          left-10
          text-5xl
          opacity-20
          animate-bounce
        ">
          🎵
        </div>


        <div className="
          absolute
          top-40
          right-20
          text-6xl
          opacity-20
          animate-pulse
        ">
          🎶
        </div>


        <div className="
          absolute
          bottom-32
          left-20
          text-4xl
          opacity-20
          animate-bounce
        ">
          🎧
        </div>


        <div className="
          absolute
          bottom-10
          right-32
          text-5xl
          opacity-20
          animate-pulse
        ">
          🎤
        </div>

      </div>


      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="
        relative
        z-20
        flex
        justify-between
        items-center
        px-8
        md:px-14
        py-6
        border-b
        border-white/10
        backdrop-blur-xl
        bg-white/5
      ">

        <h1 className="
          text-3xl
          md:text-4xl
          font-black
          tracking-widest
          text-yellow-300
        ">
          MUSICAL JAM
        </h1>


        <div className="
          flex
          gap-3
          md:gap-5
          flex-wrap
        ">

          <Link href="/register">

            <button className="
              bg-yellow-400
              hover:bg-yellow-300
              text-black
              font-bold
              px-5
              py-3
              rounded-2xl
              transition
              shadow-lg
              shadow-yellow-500/30
            ">
              Register
            </button>

          </Link>


          <Link href="/my-ticket">

            <button className="
              bg-white/10
              hover:bg-white/20
              border
              border-white/20
              font-bold
              px-5
              py-3
              rounded-2xl
              transition
            ">
              My Ticket
            </button>

          </Link>


          <Link href="/admin-login">

            <button className="
              bg-red-500
              hover:bg-red-600
              font-bold
              px-5
              py-3
              rounded-2xl
              transition
            ">
              Admin
            </button>

          </Link>

        </div>

      </nav>


      {/* =====================================
          HERO SECTION
      ===================================== */}

      <section className="
        relative
        z-10
        min-h-screen
        flex
        flex-col
        justify-center
        items-center
        text-center
        px-5
      ">

        <div className="
          backdrop-blur-2xl
          bg-white/5
          border
          border-white/10
          rounded-[40px]
          p-10
          md:p-16
          max-w-6xl
          shadow-2xl
        ">

          <p className="
            text-yellow-300
            tracking-[8px]
            uppercase
            mb-5
            font-semibold
          ">
            Live • Music • Energy • Lights
          </p>


          <h1 className="
            text-6xl
            md:text-8xl
            font-black
            leading-tight
            mb-8
          ">
            Feel The
            <span className="text-yellow-300"> Beat</span>
            <br />
            Of The Night
          </h1>


          <p className="
            max-w-3xl
            mx-auto
            text-xl
            text-gray-300
            leading-relaxed
            mb-12
          ">
            Step into an unforgettable atmosphere of music,
            lights, performances, DJs, energy, emotions,
            and memories. Experience a warm immersive night
            where every beat connects people together.
          </p>


          {/* CTA */}

          <div className="
            flex
            flex-col
            md:flex-row
            justify-center
            gap-5
            mb-16
          ">

            <Link href="/register">

              <button className="
                bg-yellow-400
                hover:bg-yellow-300
                text-black
                font-bold
                px-10
                py-5
                rounded-2xl
                text-xl
                transition
                shadow-2xl
                shadow-yellow-500/30
              ">
                Reserve Your Spot
              </button>

            </Link>


            <Link href="/my-ticket">

              <button className="
                bg-white/10
                hover:bg-white/20
                border
                border-white/20
                px-10
                py-5
                rounded-2xl
                text-xl
                transition
              ">
                View My Ticket
              </button>

            </Link>

          </div>


          {/* COUNTDOWN TIMER */}

          <div className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-5
            max-w-4xl
            mx-auto
          ">

            <div className="
              bg-white/10
              border
              border-white/10
              rounded-3xl
              p-6
            ">

              <h2 className="
                text-5xl
                font-black
                text-yellow-300
              ">
                {timeLeft.days}
              </h2>

              <p className="text-gray-300 mt-2">
                Days
              </p>

            </div>


            <div className="
              bg-white/10
              border
              border-white/10
              rounded-3xl
              p-6
            ">

              <h2 className="
                text-5xl
                font-black
                text-yellow-300
              ">
                {timeLeft.hours}
              </h2>

              <p className="text-gray-300 mt-2">
                Hours
              </p>

            </div>


            <div className="
              bg-white/10
              border
              border-white/10
              rounded-3xl
              p-6
            ">

              <h2 className="
                text-5xl
                font-black
                text-yellow-300
              ">
                {timeLeft.minutes}
              </h2>

              <p className="text-gray-300 mt-2">
                Minutes
              </p>

            </div>


            <div className="
              bg-white/10
              border
              border-white/10
              rounded-3xl
              p-6
            ">

              <h2 className="
                text-5xl
                font-black
                text-yellow-300
              ">
                {timeLeft.seconds}
              </h2>

              <p className="text-gray-300 mt-2">
                Seconds
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          EVENT SCHEDULE
      ===================================== */}

      <section className="
        relative
        z-10
        px-5
        py-20
      ">

        <div className="max-w-6xl mx-auto">

          <h2 className="
            text-5xl
            font-black
            text-center
            text-yellow-300
            mb-16
          ">
            Event Schedule
          </h2>


          <div className="space-y-6">

            <div className="
              bg-white/10
              border
              border-white/10
              rounded-3xl
              p-8
              flex
              justify-between
              items-center
              backdrop-blur-lg
            ">

              <div>

                <h3 className="
                  text-3xl
                  font-bold
                  text-yellow-300
                ">
                  Opening DJ Session
                </h3>

                <p className="text-gray-300 mt-2">
                  Warm-up vibes & crowd energy
                </p>

              </div>

              <span className="text-2xl font-bold">
                6:00 PM
              </span>

            </div>


            <div className="
              bg-white/10
              border
              border-white/10
              rounded-3xl
              p-8
              flex
              justify-between
              items-center
              backdrop-blur-lg
            ">

              <div>

                <h3 className="
                  text-3xl
                  font-bold
                  text-yellow-300
                ">
                  Live Band Performance
                </h3>

                <p className="text-gray-300 mt-2">
                  Main stage musical experience
                </p>

              </div>

              <span className="text-2xl font-bold">
                7:30 PM
              </span>

            </div>


            <div className="
              bg-white/10
              border
              border-white/10
              rounded-3xl
              p-8
              flex
              justify-between
              items-center
              backdrop-blur-lg
            ">

              <div>

                <h3 className="
                  text-3xl
                  font-bold
                  text-yellow-300
                ">
                  EDM Night Finale
                </h3>

                <p className="text-gray-300 mt-2">
                  High-energy lights & beats
                </p>

              </div>

              <span className="text-2xl font-bold">
                9:00 PM
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          ARTIST SECTION
      ===================================== */}

      <section className="
        relative
        z-10
        px-5
        py-20
      ">

        <div className="max-w-7xl mx-auto">

          <h2 className="
            text-5xl
            font-black
            text-center
            text-yellow-300
            mb-16
          ">
            Featured Artists
          </h2>


          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8
          ">

            {[1,2,3].map((artist) => (

              <div
                key={artist}
                className="
                  bg-white/10
                  border
                  border-white/10
                  rounded-[40px]
                  overflow-hidden
                  backdrop-blur-lg
                  hover:scale-105
                  transition
                  duration-300
                "
              >

                <div className="
                  h-80
                  bg-gradient-to-br
                  from-yellow-500/20
                  to-orange-500/20
                  flex
                  items-center
                  justify-center
                  text-7xl
                ">
                  🎤
                </div>


                <div className="p-8 text-center">

                  <h3 className="
                    text-3xl
                    font-bold
                    text-yellow-300
                    mb-3
                  ">
                    Artist Name
                  </h3>

                  <p className="text-gray-300 text-lg">
                    Live Performer • DJ • Music Producer
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================
          SPONSORS SECTION
      ===================================== */}

      <section className="
        relative
        z-10
        px-5
        py-20
      ">

        <div className="max-w-6xl mx-auto text-center">

          <h2 className="
            text-5xl
            font-black
            text-yellow-300
            mb-16
          ">
            Sponsors
          </h2>


          <div className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-6
          ">

            {[1,2,3,4].map((sponsor) => (

              <div
                key={sponsor}
                className="
                  bg-white/10
                  border
                  border-white/10
                  rounded-3xl
                  p-10
                  backdrop-blur-lg
                  text-2xl
                  font-bold
                  text-gray-300
                "
              >
                LOGO
              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================
          HELP SECTION
      ===================================== */}

      <section className="
        relative
        z-10
        px-5
        py-20
      ">

        <div className="
          max-w-4xl
          mx-auto
          bg-white/10
          border
          border-white/10
          rounded-[40px]
          p-12
          backdrop-blur-2xl
          text-center
        ">

          <h2 className="
            text-5xl
            font-black
            text-yellow-300
            mb-8
          ">
            Need Help?
          </h2>


          <p className="
            text-xl
            text-gray-300
            leading-relaxed
            mb-10
          ">
            For ticket support, payment issues,
            event details, sponsorships,
            or general queries,
            feel free to contact us anytime.
          </p>


          <div className="space-y-5 text-2xl">

            <p>
              <span className="text-yellow-300 font-bold">
                Contact Person:
              </span>
              {' '}
              Your Name
            </p>


            <p>
              <span className="text-yellow-300 font-bold">
                Phone:
              </span>
              {' '}
              +91 9876543210
            </p>

          </div>

        </div>

      </section>


      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="
        relative
        z-10
        border-t
        border-white/10
        py-10
        text-center
        text-gray-500
      ">

        © 2026 Musical Jam Event.
        All Rights Reserved.

      </footer>

    </div>

  );

}

