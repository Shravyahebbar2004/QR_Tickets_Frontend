'use client';

import { useState } from 'react';

import axios from 'axios';

import { useRouter } from 'next/navigation';

import {

  Sparkles,
  CalendarDays,
  MapPin,
  ImageIcon,
  Users,
  Ticket,
  Music2,
  Mic2,
  PartyPopper,
  ArrowRight,
  ScanLine,
  ShieldCheck

} from 'lucide-react';

import { motion } from 'framer-motion';

export default function CreateEventPage() {

    const router = useRouter();

  // =====================================
  // FORM STATE
  // =====================================

  const [formData, setFormData] = useState({

    title: '',
    tagline: '',
    venue: '',
    event_date: '',
    organizer_name: '',
    description: '',
    category: '',

    slab1_solo_price: '',
    slab1_couple_price: '',
    slab1_group_price: '',
    slab1_deadline: '',
    slab2_solo_price: '',
    slab2_couple_price: '',
    slab2_group_price: '',
    slab2_deadline: '',
    slab3_solo_price: '',
    slab3_couple_price: '',
    slab3_group_price: '',
    slab3_deadline: '',

    feature1_title: 'Attendees',
    feature1_value: '5K+',

    feature2_title: 'Smart Tickets',
    feature2_value: 'QR',

    feature3_title: 'Experience',
    feature3_value: 'Live'

  });

  const [bannerFile, setBannerFile] =
    useState<File | null>(null);

  const [bannerPreview, setBannerPreview] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

  // =====================================
  // HANDLE BANNER
  // =====================================

  const handleBanner = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (file) {

      setBannerFile(file);

      const imageUrl =
        URL.createObjectURL(file);

      setBannerPreview(imageUrl);

    }

  };

  // =====================================
  // HANDLE SUBMIT
  // =====================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    try {

      const data = new FormData();

      data.append(
        'title',
        formData.title
      );

      data.append(
        'tagline',
        formData.tagline
      );

      data.append(
        'venue',
        formData.venue
      );

      data.append(
        'event_date',
        formData.event_date
      );

      data.append(
        'organizer_name',
        formData.organizer_name
      );

      data.append(
        'description',
        formData.description
      );

      data.append(
        'category',
        formData.category
      );

      data.append('slab1_solo_price', formData.slab1_solo_price);
      data.append('slab1_couple_price', formData.slab1_couple_price);
      data.append('slab1_group_price', formData.slab1_group_price);
      data.append('slab1_deadline', formData.slab1_deadline);
      data.append('slab2_solo_price', formData.slab2_solo_price);
      data.append('slab2_couple_price', formData.slab2_couple_price);
      data.append('slab2_group_price', formData.slab2_group_price);
      data.append('slab2_deadline', formData.slab2_deadline);
      data.append('slab3_solo_price', formData.slab3_solo_price);
      data.append('slab3_couple_price', formData.slab3_couple_price);
      data.append('slab3_group_price', formData.slab3_group_price);
      data.append('slab3_deadline', formData.slab3_deadline);

      data.append(
        'feature1_title',
        formData.feature1_title
      );

      data.append(
        'feature1_value',
        formData.feature1_value
      );

      data.append(
        'feature2_title',
        formData.feature2_title
      );

      data.append(
        'feature2_value',
        formData.feature2_value
      );

      data.append(
        'feature3_title',
        formData.feature3_title
      );

      data.append(
        'feature3_value',
        formData.feature3_value
      );

      if (bannerFile) {

        data.append(
          'banner',
          bannerFile
        );

      }

      const response = await axios.post(

  `${process.env.NEXT_PUBLIC_API_URL}/api/create-event`,

  data,

  {

    headers: {

      'Content-Type':
        'multipart/form-data'

    }

  }

);

console.log(response.data);

console.log(

  'EVENT OBJECT:',

  response.data.event

);

console.log(

  'EVENT ID:',

  response.data.event?.event_id

);

// GET EVENT ID

const eventId =

  response.data.event.event_id;

// REDIRECT TO EVENT WEBSITE

router.push(

  `/event/${eventId}`

);



    } catch (error) {

      console.log(error);

      alert(
        'Event Creation Failed'
      );

    } finally {

      setLoading(false);

    }

  };

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

      {/* BACKGROUND LIGHTS */}

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

      </div>

      {/* MAIN */}

      <div className="
        relative
        z-10
        max-w-7xl
        mx-auto
        px-5
        py-32
      ">

        {/* HERO */}

        <motion.div

          initial={{ opacity: 0, y: 40 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.8 }}

          className="text-center mb-20"

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
              text-gray-300
            ">
              Launch Your Event Website Instantly
            </p>

          </div>

          <h1 className="
            text-6xl
            md:text-8xl
            font-black
            leading-tight
            mb-8
          ">

            Create Your

            <span className="
              bg-gradient-to-r
              from-cyan-300
              to-violet-500
              text-transparent
              bg-clip-text
            ">
              {' '}Dream Event
            </span>

          </h1>

          <p className="
            text-xl
            md:text-2xl
            text-gray-400
            max-w-4xl
            mx-auto
            leading-relaxed
          ">

            Build premium event experiences
            with QR ticketing,
            registrations,
            scanner access,
            analytics and your own
            event website.

          </p>

        </motion.div>

        {/* GRID */}

        <div className="
          grid
          lg:grid-cols-2
          gap-12
          items-start
        ">

          {/* FORM */}

          <motion.form

            initial={{ opacity: 0, x: -40 }}

            animate={{ opacity: 1, x: 0 }}

            transition={{ duration: 0.8 }}

            onSubmit={handleSubmit}

            className="
              bg-white/5
              backdrop-blur-2xl
              border
              border-white/10
              rounded-[40px]
              p-8
              md:p-10
              shadow-2xl
            "

          >

            {/* EVENT TITLE */}

            <div className="mb-6">

              <label className="
                block
                mb-3
                text-lg
                text-gray-300
              ">
                Event Title
              </label>

              <input

                type="text"

                name="title"

                placeholder="Ex: Musical Jam 2026"

                value={formData.title}

                onChange={handleChange}

                required

                className="
                  w-full
                  p-5
                  rounded-2xl
                  bg-black/40
                  border
                  border-white/10
                  text-white
                "

              />

            </div>

            {/* TAGLINE */}

            <div className="mb-6">

              <label className="
                block
                mb-3
                text-lg
                text-gray-300
              ">
                Event Tagline
              </label>

              <input

                type="text"

                name="tagline"

                placeholder="Feel The Energy"

                value={formData.tagline}

                onChange={handleChange}

                className="
                  w-full
                  p-5
                  rounded-2xl
                  bg-black/40
                  border
                  border-white/10
                  text-white
                "

              />

            </div>

            {/* CATEGORY */}

            <div className="mb-6">

              <label className="
                text-gray-300
                mb-3
                block
                text-lg
              ">
                Event Category
              </label>

              <input

                type="text"

                name="category"

                placeholder="
Ex: Marathon, Tech Fest, Startup Meetup
                "

                value={formData.category}

                onChange={handleChange}

                list="event-categories"

                className="
                  w-full
                  p-5
                  rounded-2xl
                  bg-black/40
                  border
                  border-white/10
                  text-white
                "

              />

              <datalist id="event-categories">

                <option value="Music Festival" />

                <option value="Hackathon" />

                <option value="Marathon" />

                <option value="Startup Meetup" />

                <option value="Workshop" />

                <option value="Conference" />

                <option value="College Fest" />

                <option value="NGO Fundraiser" />

                <option value="Gaming Tournament" />

              </datalist>

            </div>

            {/* VENUE */}

            <div className="mb-6">

              <label className="
                flex
                items-center
                gap-2
                mb-3
                text-lg
                text-gray-300
              ">

                <MapPin size={18} />

                Venue

              </label>

              <input

                type="text"

                name="venue"

                placeholder="
Ex: Bangalore International Arena
                "

                value={formData.venue}

                onChange={handleChange}

                className="
                  w-full
                  p-5
                  rounded-2xl
                  bg-black/40
                  border
                  border-white/10
                  text-white
                "

              />

            </div>

            {/* DATE */}

            <div className="mb-6">

              <label className="
                flex
                items-center
                gap-2
                mb-3
                text-lg
                text-gray-300
              ">

                <CalendarDays size={18} />

                Event Date

              </label>

              <input

                type="datetime-local"

                name="event_date"

                value={formData.event_date}

                onChange={handleChange}

                className="
                  w-full
                  p-5
                  rounded-2xl
                  bg-black/40
                  border
                  border-white/10
                  text-white
                "

              />

            </div>

            {/* ORGANIZER */}

            <div className="mb-6">

              <label className="
                block
                mb-3
                text-lg
                text-gray-300
              ">
                Organizer Name
              </label>

              <input

                type="text"

                name="organizer_name"

                placeholder="
Ex: EventFlow Studios
                "

                value={formData.organizer_name}

                onChange={handleChange}

                className="
                  w-full
                  p-5
                  rounded-2xl
                  bg-black/40
                  border
                  border-white/10
                  text-white
                "

              />

            </div>

            {/* DESCRIPTION */}

            <div className="mb-8">

              <label className="
                block
                mb-3
                text-lg
                text-gray-300
              ">
                Event Description
              </label>

              <textarea

                name="description"

                rows={5}

                placeholder="
Tell attendees what makes your event special...
                "

                value={formData.description}

                onChange={handleChange}

                className="
                  w-full
                  p-5
                  rounded-2xl
                  bg-black/40
                  border
                  border-white/10
                  text-white
                "

              />

            </div>

            {/* SLAB PRICING */}

            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 text-cyan-300">
                Ticket Pricing Slabs
              </h2>
              <div className="grid md:grid-cols-3 gap-5">
                {/* SLAB 1 */}
                <div className="bg-black/20 p-5 rounded-2xl border border-white/10">
                  <h3 className="font-bold mb-4">Slab 1 (Early Bird)</h3>
                  <label className="block text-gray-400 text-sm mb-2">Deadline</label>
                  <input type="datetime-local" name="slab1_deadline" value={formData.slab1_deadline} onChange={handleChange} className="w-full p-3 mb-4 rounded-xl bg-black/40 border border-white/10 text-white" />
                  <label className="block text-gray-400 text-sm mb-2">Solo Price (₹)</label>
                  <input type="number" name="slab1_solo_price" value={formData.slab1_solo_price} onChange={handleChange} placeholder="299" className="w-full p-3 mb-4 rounded-xl bg-black/40 border border-white/10 text-white" />
                  <label className="block text-gray-400 text-sm mb-2">Couple Price (₹)</label>
                  <input type="number" name="slab1_couple_price" value={formData.slab1_couple_price} onChange={handleChange} placeholder="499" className="w-full p-3 mb-4 rounded-xl bg-black/40 border border-white/10 text-white" />
                  <label className="block text-gray-400 text-sm mb-2">Group Price (₹)</label>
                  <input type="number" name="slab1_group_price" value={formData.slab1_group_price} onChange={handleChange} placeholder="999" className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white" />
                </div>
                {/* SLAB 2 */}
                <div className="bg-black/20 p-5 rounded-2xl border border-white/10">
                  <h3 className="font-bold mb-4">Slab 2 (Regular)</h3>
                  <label className="block text-gray-400 text-sm mb-2">Deadline</label>
                  <input type="datetime-local" name="slab2_deadline" value={formData.slab2_deadline} onChange={handleChange} className="w-full p-3 mb-4 rounded-xl bg-black/40 border border-white/10 text-white" />
                  <label className="block text-gray-400 text-sm mb-2">Solo Price (₹)</label>
                  <input type="number" name="slab2_solo_price" value={formData.slab2_solo_price} onChange={handleChange} placeholder="399" className="w-full p-3 mb-4 rounded-xl bg-black/40 border border-white/10 text-white" />
                  <label className="block text-gray-400 text-sm mb-2">Couple Price (₹)</label>
                  <input type="number" name="slab2_couple_price" value={formData.slab2_couple_price} onChange={handleChange} placeholder="699" className="w-full p-3 mb-4 rounded-xl bg-black/40 border border-white/10 text-white" />
                  <label className="block text-gray-400 text-sm mb-2">Group Price (₹)</label>
                  <input type="number" name="slab2_group_price" value={formData.slab2_group_price} onChange={handleChange} placeholder="1299" className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white" />
                </div>
                {/* SLAB 3 */}
                <div className="bg-black/20 p-5 rounded-2xl border border-white/10">
                  <h3 className="font-bold mb-4">Slab 3 (Late)</h3>
                  <label className="block text-gray-400 text-sm mb-2">Deadline</label>
                  <input type="datetime-local" name="slab3_deadline" value={formData.slab3_deadline} onChange={handleChange} className="w-full p-3 mb-4 rounded-xl bg-black/40 border border-white/10 text-white" />
                  <label className="block text-gray-400 text-sm mb-2">Solo Price (₹)</label>
                  <input type="number" name="slab3_solo_price" value={formData.slab3_solo_price} onChange={handleChange} placeholder="499" className="w-full p-3 mb-4 rounded-xl bg-black/40 border border-white/10 text-white" />
                  <label className="block text-gray-400 text-sm mb-2">Couple Price (₹)</label>
                  <input type="number" name="slab3_couple_price" value={formData.slab3_couple_price} onChange={handleChange} placeholder="899" className="w-full p-3 mb-4 rounded-xl bg-black/40 border border-white/10 text-white" />
                  <label className="block text-gray-400 text-sm mb-2">Group Price (₹)</label>
                  <input type="number" name="slab3_group_price" value={formData.slab3_group_price} onChange={handleChange} placeholder="1599" className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white" />
                </div>
              </div>
            </div>

            {/* EVENT HIGHLIGHTS */}

            <div className="mb-10">

              <h2 className="
                text-2xl
                font-bold
                mb-6
                text-cyan-300
              ">
                Event Highlights
              </h2>

              <div className="
                grid
                md:grid-cols-3
                gap-5
              ">

                {/* CARD 1 */}

                <div>

                  <input

                    type="text"

                    name="feature1_value"

                    placeholder="Ex: 10K+"

                    value={formData.feature1_value}

                    onChange={handleChange}

                    className="
                      w-full
                      p-4
                      rounded-2xl
                      bg-black/40
                      border
                      border-white/10
                      text-white
                      mb-3
                    "

                  />

                  <input

                    type="text"

                    name="feature1_title"

                    placeholder="Ex: Participants"

                    value={formData.feature1_title}

                    onChange={handleChange}

                    className="
                      w-full
                      p-4
                      rounded-2xl
                      bg-black/40
                      border
                      border-white/10
                      text-white
                    "

                  />

                </div>

                {/* CARD 2 */}

                <div>

                  <input

                    type="text"

                    name="feature2_value"

                    placeholder="Ex: Save Earth"

                    value={formData.feature2_value}

                    onChange={handleChange}

                    className="
                      w-full
                      p-4
                      rounded-2xl
                      bg-black/40
                      border
                      border-white/10
                      text-white
                      mb-3
                    "

                  />

                  <input

                    type="text"

                    name="feature2_title"

                    placeholder="Ex: Cause"

                    value={formData.feature2_title}

                    onChange={handleChange}

                    className="
                      w-full
                      p-4
                      rounded-2xl
                      bg-black/40
                      border
                      border-white/10
                      text-white
                    "

                  />

                </div>

                {/* CARD 3 */}

                <div>

                  <input

                    type="text"

                    name="feature3_value"

                    placeholder="Ex: 21KM"

                    value={formData.feature3_value}

                    onChange={handleChange}

                    className="
                      w-full
                      p-4
                      rounded-2xl
                      bg-black/40
                      border
                      border-white/10
                      text-white
                      mb-3
                    "

                  />

                  <input

                    type="text"

                    name="feature3_title"

                    placeholder="Ex: Marathon"

                    value={formData.feature3_title}

                    onChange={handleChange}

                    className="
                      w-full
                      p-4
                      rounded-2xl
                      bg-black/40
                      border
                      border-white/10
                      text-white
                    "

                  />

                </div>

              </div>

            </div>

            {/* BANNER */}

            <div className="mb-10">

              <label className="
                flex
                items-center
                gap-2
                mb-3
                text-lg
                text-gray-300
              ">

                <ImageIcon size={18} />

                Event Banner

              </label>

              <input

                type="file"

                accept="image/*"

                onChange={handleBanner}

                className="
                  w-full
                  p-5
                  rounded-2xl
                  bg-black/40
                  border
                  border-white/10
                  text-white
                "

              />

            </div>

            {/* SUBMIT */}

            <button

              type="submit"

              disabled={loading}

              className="
                w-full
                bg-violet-500
                hover:bg-violet-600
                disabled:bg-gray-500
                py-5
                rounded-2xl
                text-xl
                font-bold
                transition
                shadow-2xl
                shadow-violet-500/30
                hover:scale-[1.02]
                flex
                items-center
                justify-center
                gap-3
              "

            >

              {

                loading

                  ? 'Launching...'

                  : 'Launch Event Website'

              }

              <ArrowRight size={22} />

            </button>

          </motion.form>

          {/* LIVE PREVIEW */}

          <motion.div

            initial={{ opacity: 0, x: 40 }}

            animate={{ opacity: 1, x: 0 }}

            transition={{ duration: 0.8 }}

            className="
              sticky
              top-28
            "

          >

            <div className="
              bg-white/5
              backdrop-blur-2xl
              border
              border-white/10
              rounded-[40px]
              overflow-hidden
              shadow-2xl
            ">

              {/* BANNER */}

              <div className="
                h-[300px]
                relative
                overflow-hidden
              ">

                {

                  bannerPreview ? (

                    <img

                      src={bannerPreview}

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
                      flex
                      items-center
                      justify-center
                    ">

                      <PartyPopper
                        size={90}
                        className="
                          text-white/70
                        "
                      />

                    </div>

                  )

                }

              </div>

              {/* CONTENT */}

              <div className="p-8">

                <div className="
                  inline-flex
                  items-center
                  gap-2
                  bg-white/5
border-white/10
backdrop-blur-xl
hover:scale-105
transition                  px-4
                  py-2
                  rounded-full
                  mb-6
                ">

                  <Music2
                    size={16}
                    className="
                      text-cyan-300
                    "
                  />

                  <p className="
                    text-sm
                    text-gray-300
                  ">

                    {

                      formData.category ||

                      'Event Category'

                    }

                  </p>

                </div>

                <h1 className="
                  text-5xl
                  font-black
                  mb-4
                ">

                  {

                    formData.title ||

                    'Your Event Name'

                  }

                </h1>

                <p className="
                  text-xl
                  text-gray-400
                  mb-8
                ">

                  {

                    formData.tagline ||

                    'Your event tagline'

                  }

                </p>

                {/* DETAILS */}

                <div className="
                  flex
                  flex-wrap
                  gap-4
                  mb-8
                ">

                  <div className="
                    bg-white/5
border-white/10
backdrop-blur-xl
hover:scale-105
transition                    px-5
                    py-3
                    rounded-2xl
                    flex
                    items-center
                    gap-3
                  ">

                    <MapPin
                      size={18}
                      className="
                        text-cyan-300
                      "
                    />

                    <p className="
                      text-gray-300
                    ">

                      {

                        formData.venue ||

                        'Your Venue'

                      }

                    </p>

                  </div>

                  <div className="
                    bg-white/5
border-white/10
backdrop-blur-xl
hover:scale-105
transition                    px-5
                    py-3
                    rounded-2xl
                    flex
                    items-center
                    gap-3
                  ">

                    <CalendarDays
                      size={18}
                      className="
                        text-violet-300
                      "
                    />

                    <p className="
                      text-gray-300
                    ">

                      {

                        formData.event_date ||

                        'Event Date'

                      }

                    </p>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <p className="
                  text-gray-400
                  leading-relaxed
                  text-lg
                  mb-10
                ">

                  {

                    formData.description ||

                    'Your event description will appear here beautifully.'

                  }

                </p>

                {/* FEATURES */}

                <div className="
                  grid
                  md:grid-cols-3
                  gap-5
                ">

                  {/* CARD 1 */}

                  <div className="
                    bg-white/5
border-white/10
backdrop-blur-xl
hover:scale-105
transition                    border
                    border-white/10
                    rounded-3xl
                    p-5
                    text-center
                  ">

                    <Users
                      size={36}
                      className="
                        text-cyan-300
                        mx-auto
                        mb-3
                      "
                    />

                    <h3 className="
                      text-2xl
                      font-bold
                    ">

                      {

                        formData.feature1_value ||

                        '5K+'

                      }

                    </h3>

                    <p className="
                      text-gray-400
                    ">

                      {

                        formData.feature1_title ||

                        'Attendees'

                      }

                    </p>

                  </div>

                  {/* CARD 2 */}

                  <div className="
                    bg-white/5
border-white/10
backdrop-blur-xl
hover:scale-105
transition                    border
                    border-white/10
                    rounded-3xl
                    p-5
                    text-center
                  ">

                    <ShieldCheck
                      size={36}
                      className="
                        text-violet-300
                        mx-auto
                        mb-3
                      "
                    />

                    <h3 className="
                      text-2xl
                      font-bold
                    ">

                      {

                        formData.feature2_value ||

                        'QR'

                      }

                    </h3>

                    <p className="
                      text-gray-400
                    ">

                      {

                        formData.feature2_title ||

                        'Smart Tickets'

                      }

                    </p>

                  </div>

                  {/* CARD 3 */}

                  <div className="
                    bg-white/5
border-white/10
backdrop-blur-xl
hover:scale-105
transition                    border
                    border-white/10
                    rounded-3xl
                    p-5
                    text-center
                  ">

                    <ScanLine
                      size={36}
                      className="
                        text-pink-300
                        mx-auto
                        mb-3
                      "
                    />

                    <h3 className="
                      text-2xl
                      font-bold
                    ">

                      {

                        formData.feature3_value ||

                        'Live'

                      }

                    </h3>

                    <p className="
                      text-gray-400
                    ">

                      {

                        formData.feature3_title ||

                        'Experience'

                      }

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </main>

  );

}