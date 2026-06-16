
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

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // FETCH EVENTS //

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEventClick = () => {
    const token = localStorage.getItem('platform_token');
    if (token) {
      router.push('/create-event');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/platform/login`, loginForm);
      if (response.data.success) {
        localStorage.setItem('platform_token', response.data.token);
        setShowLoginModal(false);
        router.push('/create-event');
      }
    } catch (err: any) {
      setLoginError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

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

            <button onClick={handleCreateEventClick} className="
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
                Create Your Event (Organizers)
              </button>

            <button 
              onClick={() => {
                localStorage.removeItem('platform_token');
                router.push('/login');
              }}
              className="
                bg-red-500
                hover:bg-red-600
                px-6
                py-3
                rounded-2xl
                font-bold
                transition
                shadow-lg
                shadow-red-500/30
                hover:scale-105
                text-white
              ">
              Platform Logout
            </button>

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

              <button
                onClick={() => { setMenuOpen(false); handleCreateEventClick(); }}
                className="
                  text-4xl
                  font-black
                  text-cyan-300
                "
              >
                Create Your Event (Organizers)
              </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                localStorage.removeItem('platform_token');
                router.push('/login');
              }}
              className="
                text-4xl
                font-black
                text-red-400
              "
            >
              Platform Logout
            </button>

          </div>

        )
      }

      {/* HERO SECTION */}

      <section className="
        relative
        z-10
        flex
        items-center
        justify-center
        px-5
        pt-40
        pb-20
        md:pt-48
        md:pb-32
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

              <button onClick={handleCreateEventClick} className="
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
                Create Your Event
              </button>

            <button
              onClick={() => {
                document.getElementById('live-events')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="
                bg-white/10
                hover:bg-white/20
                px-10
                py-5
                rounded-2xl
                text-lg
                md:text-xl
                font-bold
                transition
                w-full
                md:w-auto
              "
            >
              Browse Live Events
            </button>

          </div>

          {/* COUNTDOWN REMOVED */}

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

      {/* HOW IT HELPS */}
      <section className="relative z-10 px-5 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Transforming Experiences
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              EventFlow is engineered to deliver a seamless, premium experience for both the people running the show and the attendees enjoying it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* For Organizers */}
            <div className="bg-gradient-to-br from-violet-900/40 to-black border border-violet-500/20 rounded-[40px] p-10 md:p-14 shadow-2xl backdrop-blur-xl hover:scale-[1.02] transition">
              <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center mb-8 border border-violet-500/30">
                <ShieldCheck size={32} className="text-violet-300" />
              </div>
              <h3 className="text-4xl font-black text-white mb-6">For Organizers</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-violet-500/20 p-1.5 rounded-full"><ArrowRight size={16} className="text-violet-300"/></div>
                  <p className="text-lg text-gray-300 leading-relaxed">Instantly generate and distribute secure, unforgeable QR tickets to all attendees.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-violet-500/20 p-1.5 rounded-full"><ArrowRight size={16} className="text-violet-300"/></div>
                  <p className="text-lg text-gray-300 leading-relaxed">Dedicated Scanner Dashboard allows your staff to validate entries in milliseconds at the gate.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-violet-500/20 p-1.5 rounded-full"><ArrowRight size={16} className="text-violet-300"/></div>
                  <p className="text-lg text-gray-300 leading-relaxed">Manage bulk passes, solo tickets, and payment approvals from a centralized admin panel.</p>
                </li>
              </ul>
            </div>

            {/* For Attendees */}
            <div className="bg-gradient-to-br from-cyan-900/40 to-black border border-cyan-500/20 rounded-[40px] p-10 md:p-14 shadow-2xl backdrop-blur-xl hover:scale-[1.02] transition">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-8 border border-cyan-500/30">
                <Ticket size={32} className="text-cyan-300" />
              </div>
              <h3 className="text-4xl font-black text-white mb-6">For Attendees</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-cyan-500/20 p-1.5 rounded-full"><ArrowRight size={16} className="text-cyan-300"/></div>
                  <p className="text-lg text-gray-300 leading-relaxed">Lightning-fast registration process with instant email delivery of your digital pass.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-cyan-500/20 p-1.5 rounded-full"><ArrowRight size={16} className="text-cyan-300"/></div>
                  <p className="text-lg text-gray-300 leading-relaxed">No more waiting in massive queues—just flash your QR code at the entrance and walk in.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-cyan-500/20 p-1.5 rounded-full"><ArrowRight size={16} className="text-cyan-300"/></div>
                  <p className="text-lg text-gray-300 leading-relaxed">Beautifully formatted mobile tickets that are easy to screenshot or download directly to your phone.</p>
                </li>
              </ul>
            </div>
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

            <button onClick={handleCreateEventClick} className="
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

        </div>

      </section>

      {/* ===================================== */}
      {/* LIVE EVENTS */}
      {/* ===================================== */}

      <section id="live-events" className="
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

                    <Link

                      key={event.event_id}

                      href={`/event/${event.event_id}`}

                      className="
        block
      "

                    >

                      <div

                        className="
          bg-white/5
          backdrop-blur-2xl
          border
          border-white/10
          rounded-[40px]
          p-8
          hover:scale-105
          transition-all
          duration-300
          cursor-pointer
          h-full
        "

                      >

                        <h3 className="
          text-3xl
          font-black
          mb-5
        ">

                          {event.title}

                        </h3>

                        <p className="
          text-gray-400
          text-lg
          leading-relaxed
          mb-6
        ">

                          {event.description}

                        </p>

                        <p className="
          text-violet-300
          text-lg
          mb-3
        ">

                          📍 {event.venue}

                        </p>

                        <p className="
          text-pink-300
          text-lg
        ">

                          🎫 {event.category}

                        </p>

                        <div className="
          mt-8
        ">

                          <span className="
            inline-block
            bg-violet-500
            hover:bg-violet-600
            px-8
            py-3
            rounded-2xl
            text-lg
            font-bold
            transition
            shadow-xl
            shadow-violet-500/30
          ">

                            View Event →

                          </span>

                        </div>

                      </div>

                    </Link>

                  ))

                }








              </div>

            )

        }

      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-12 text-center text-gray-500">
        <p className="mb-4">© 2026 EventFlow Platform. All Rights Reserved.</p>
        <p className="text-gray-400">For more details, contact <strong className="text-white">Shravya Hebbar</strong> at <a href="mailto:shravyahebbar07@gmail.com" className="text-cyan-400 hover:underline font-medium">shravyahebbar07@gmail.com</a></p>
      </footer>

      {showLoginModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-5">
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[40px] p-10 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white transition">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-white mb-2 text-center">Organizer Login</h2>
            <p className="text-gray-400 text-center mb-8">Access your event dashboard.</p>
            {loginError && <div className="bg-red-500/20 text-red-300 p-3 rounded-xl mb-6 text-center text-sm">{loginError}</div>}
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Email</label>
                <input type="email" required value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500 transition focus:ring-2 focus:ring-cyan-500/50" placeholder="Admin Email" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Password</label>
                <input type="password" required value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500 transition focus:ring-2 focus:ring-cyan-500/50" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loginLoading} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-4 rounded-2xl transition shadow-lg shadow-cyan-500/30 disabled:opacity-50">
                {loginLoading ? 'Authenticating...' : 'Login to Dashboard'}
              </button>
            </form>
          </div>
        </div>
      )}

    </main>

  );

}



