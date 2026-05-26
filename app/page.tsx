'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import {

  Menu,
  X

} from 'lucide-react';

export default function HomePage() {

  const [menuOpen, setMenuOpen] = useState(false);

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

      <div className="
        absolute
        inset-0
        overflow-hidden
      ">

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
          FLOATING ICONS
      ===================================== */}

      <div className="
        absolute
        inset-0
        pointer-events-none
        overflow-hidden
      ">

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
        px-5
        md:px-14
        py-6
        border-b
        border-white/10
        backdrop-blur-xl
        bg-white/5
      ">

        <h1 className="
          text-2xl
          sm:text-3xl
          md:text-4xl
          font-black
          tracking-widest
          text-yellow-300
        ">
          MUSICAL JAM
        </h1>




        {/* MOBILE MENU BUTTON */}

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
          gap-5
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

          <Link href="/scanner-login">

             <button className="
              bg-blue-500
              hover:bg-blue-600
              font-bold
              px-5
              py-3
              rounded-2xl
              transition
              text-white
            ">
             Scanner
            </button>

          </Link>

        </div>

      </nav>




      {/* =====================================
          MOBILE SIDEBAR
      ===================================== */}

      {

        menuOpen && (

          <div className="
            fixed
            inset-0
            bg-black/90
            backdrop-blur-2xl
            z-50
            flex
            flex-col
            items-center
            justify-center
            gap-10
          ">

            <Link href="/register">

              <button

                onClick={() =>

                  setMenuOpen(false)

                }

                className="
                  text-4xl
                  font-black
                  text-yellow-300
                "

              >
                Register
              </button>

            </Link>




            <Link href="/my-ticket">

              <button

                onClick={() =>

                  setMenuOpen(false)

                }

                className="
                  text-4xl
                  font-black
                  text-white
                "

              >
                My Ticket
              </button>

            </Link>




            <Link href="/admin-login">

              <button

                onClick={() =>

                  setMenuOpen(false)

                }

                className="
                  text-4xl
                  font-black
                  text-red-400
                "

              >
                Admin
              </button>

            </Link>

             <Link href="/scanner-login">

                <button

                   onClick={() =>

                   setMenuOpen(false)

                 }

               className="
               text-4xl
               font-black
               text-blue-400
               "

              >
             Scanner
           </button>

          </Link>     

          </div>

        )

      }




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
          p-6
          sm:p-10
          md:p-16
          max-w-6xl
          shadow-2xl
        ">

          <p className="
            text-yellow-300
            tracking-[5px]
            md:tracking-[8px]
            uppercase
            mb-5
            font-semibold
            text-sm
            md:text-base
          ">
            Live • Music • Energy • Lights
          </p>




          <h1 className="
            text-5xl
            sm:text-6xl
            md:text-8xl
            font-black
            leading-tight
            mb-8
          ">
            Feel The
            <span className="
              text-yellow-300
            ">
              {' '}
              Beat
            </span>

            <br />

            Of The Night
          </h1>




          <p className="
            max-w-3xl
            mx-auto
            text-lg
            md:text-xl
            text-gray-300
            leading-relaxed
            mb-12
          ">
            Step into an unforgettable atmosphere
            of music, lights, performances,
            DJs, energy, emotions, and memories.
            Experience a warm immersive night
            where every beat connects people
            together.
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
                px-8
                md:px-10
                py-4
                md:py-5
                rounded-2xl
                text-lg
                md:text-xl
                transition
                shadow-2xl
                shadow-yellow-500/30
                w-full
                md:w-auto
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
                px-8
                md:px-10
                py-4
                md:py-5
                rounded-2xl
                text-lg
                md:text-xl
                transition
                w-full
                md:w-auto
              ">
                View My Ticket
              </button>

            </Link>
                   
               <Link href="/scanner-login">

                 <button className="
                 bg-blue-500/20
                 hover:bg-blue-500/30
                 border
                 border-blue-400/30
                 px-8
                 md:px-10
                 py-4
                 md:py-5
                 rounded-2xl
                 text-lg
                 md:text-xl
                 transition
                 w-full
                 md:w-auto
                 text-white
                 font-bold
                ">
              Scanner Login
            </button>

          </Link>

        </div>




          {/* COUNTDOWN */}

          <div className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-5
            max-w-4xl
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
                    bg-white/10
                    border
                    border-white/10
                    rounded-3xl
                    p-4
                    md:p-6
                  "

                >

                  <h2 className="
                    text-4xl
                    md:text-5xl
                    font-black
                    text-yellow-300
                  ">
                    {item.value}
                  </h2>

                  <p className="
                    text-gray-300
                    mt-2
                  ">
                    {item.label}
                  </p>

                </div>

              ))

            }

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

        <div className="
          max-w-6xl
          mx-auto
        ">

          <h2 className="
            text-4xl
            md:text-5xl
            font-black
            text-center
            text-yellow-300
            mb-16
          ">
            Event Schedule
          </h2>




          <div className="
            space-y-6
          ">

            {

              [

                {

                  title: 'Opening DJ Session',
                  desc: 'Warm-up vibes & crowd energy',
                  time: '6:00 PM'

                },

                {

                  title: 'Live Band Performance',
                  desc: 'Main stage musical experience',
                  time: '7:30 PM'

                },

                {

                  title: 'EDM Night Finale',
                  desc: 'High-energy lights & beats',
                  time: '9:00 PM'

                }

              ].map((event, index) => (

                <div

                  key={index}

                  className="
                    bg-white/10
                    border
                    border-white/10
                    rounded-3xl
                    p-6
                    md:p-8
                    flex
                    flex-col
                    md:flex-row
                    justify-between
                    items-start
                    md:items-center
                    gap-5
                    backdrop-blur-lg
                  "

                >

                  <div>

                    <h3 className="
                      text-2xl
                      md:text-3xl
                      font-bold
                      text-yellow-300
                    ">
                      {event.title}
                    </h3>

                    <p className="
                      text-gray-300
                      mt-2
                    ">
                      {event.desc}
                    </p>

                  </div>



                  <span className="
                    text-xl
                    md:text-2xl
                    font-bold
                  ">
                    {event.time}
                  </span>

                </div>

              ))

            }

          </div>

        </div>

      </section>

            {/* =====================================
          FEATURED ARTISTS
      ===================================== */}

      <section className="
        relative
        z-10
        px-5
        py-20
      ">

        <div className="max-w-6xl mx-auto">

          <h2 className="
            text-4xl
            md:text-5xl
            font-black
            text-center
            text-yellow-300
            mb-16
          ">
            Featured Artists
          </h2>

          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">

            <div className="
              bg-white/10
              border
              border-white/10
              rounded-3xl
              p-8
              backdrop-blur-lg
            ">

              <h3 className="
                text-3xl
                font-bold
                text-yellow-300
                mb-4
              ">
                DJ NightStorm
              </h3>

              <p className="text-gray-300">
                Experience electrifying EDM beats,
                immersive lights, and unforgettable
                energy throughout the night.
              </p>

            </div>

            <div className="
              bg-white/10
              border
              border-white/10
              rounded-3xl
              p-8
              backdrop-blur-lg
            ">

              <h3 className="
                text-3xl
                font-bold
                text-yellow-300
                mb-4
              ">
                Fusion Beats Band
              </h3>

              <p className="text-gray-300">
                Live fusion performances combining
                Bollywood, Indie Rock, and modern
                music experiences.
              </p>

            </div>

            <div className="
              bg-white/10
              border
              border-white/10
              rounded-3xl
              p-8
              backdrop-blur-lg
            ">

              <h3 className="
                text-3xl
                font-bold
                text-yellow-300
                mb-4
              ">
                Surprise Guest Artist
              </h3>

              <p className="text-gray-300">
                Special celebrity performance to
                make the event even more memorable.
              </p>

            </div>

          </div>

        </div>

      </section>




      {/* =====================================
          SPONSORS
      ===================================== */}

      <section className="
        relative
        z-10
        px-5
        py-20
      ">

        <div className="max-w-6xl mx-auto">

          <h2 className="
            text-4xl
            md:text-5xl
            font-black
            text-center
            text-yellow-300
            mb-16
          ">
            Sponsors & Partners
          </h2>

          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">

            <div className="
              bg-white/10
              border
              border-white/10
              rounded-3xl
              p-8
              text-center
              backdrop-blur-lg
            ">

              <h3 className="
                text-2xl
                font-bold
              ">
                XYZ Bank
              </h3>

              <p className="
                text-gray-300
                mt-4
              ">
                Official Banking Partner
              </p>

            </div>

            <div className="
              bg-white/10
              border
              border-white/10
              rounded-3xl
              p-8
              text-center
              backdrop-blur-lg
            ">

              <h3 className="
                text-2xl
                font-bold
              ">
                SoundWave Studios
              </h3>

              <p className="
                text-gray-300
                mt-4
              ">
                Audio & Production Partner
              </p>

            </div>

            <div className="
              bg-white/10
              border
              border-white/10
              rounded-3xl
              p-8
              text-center
              backdrop-blur-lg
            ">

              <h3 className="
                text-2xl
                font-bold
              ">
                Glow Energy
              </h3>

              <p className="
                text-gray-300
                mt-4
              ">
                Energy Drink Partner
              </p>

            </div>

          </div>

        </div>

      </section>




      {/* =====================================
          HELP DESK
      ===================================== */}

      <section className="
        relative
        z-10
        px-5
        py-20
      ">

        <div className="
          max-w-3xl
          mx-auto
          text-center
          bg-white/10
          border
          border-white/10
          rounded-[40px]
          p-10
          backdrop-blur-2xl
        ">

          <h2 className="
            text-4xl
            md:text-5xl
            font-black
            text-yellow-300
            mb-8
          ">
            Help Desk
          </h2>

          <p className="
            text-gray-300
            text-lg
            mb-6
          ">
            For registration support,
            ticket issues, or event queries,
            contact us anytime.
          </p>

          <h3 className="
            text-3xl
            font-bold
          ">
            abc
          </h3>

          <p className="
            text-yellow-300
            text-2xl
            mt-4
            font-bold
          ">
            +91 XXXXX XXXXX
          </p>

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
        text-sm
        md:text-base
      ">

        © 2026 Musical Jam Event.
        All Rights Reserved.

      </footer>

    </div>

  );

}

