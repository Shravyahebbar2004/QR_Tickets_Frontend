'use client';

import {

  useEffect,
  useState,
  use

} from 'react';

import axios from 'axios';

export default function RegisterPage({

  params

}: {

  params: Promise<{

    id: string

  }>

}) {

  const { id } = use(params);

  // =====================================
  // STATES
  // =====================================

  const [event, setEvent] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [totalAmount, setTotalAmount] =
    useState(299);

  const [allowedEntries, setAllowedEntries] =
    useState(1);

  const [formData, setFormData] =
    useState({

      full_name: '',
      email: '',
      phone_number: '',
      ticket_type: 'solo'

    });

  const [paymentProof, setPaymentProof] =
    useState<any>(null);

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

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
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (

  e: React.ChangeEvent<

    HTMLInputElement |

    HTMLSelectElement

  >

) => {

  const {

    name,
    value

  } = e.target;

  setFormData({

    ...formData,

    [name]: value

  });

  // TICKET LOGIC

  if (

    name === 'ticket_type'

  ) {

    if (value === 'solo') {

      setTotalAmount(299);

      setAllowedEntries(1);

    }

    else if (

      value === 'couple'

    ) {

      setTotalAmount(499);

      setAllowedEntries(2);

    }

    else if (

      value === 'group'

    ) {

      setTotalAmount(999);

      setAllowedEntries(5);

    }

  }

};
  // =====================================
  // HANDLE REGISTER
  // =====================================

  const handleSubmit = async (

    e: React.FormEvent

  ) => {

    e.preventDefault();

    try {

      setSubmitting(true);

      const submitData = new FormData();

      submitData.append(

        'full_name',

        formData.full_name

      );

      submitData.append(

        'email',

        formData.email

      );

      submitData.append(

        'phone_number',

        formData.phone_number

      );

      submitData.append(

  'total_amount',

  totalAmount.toString()

);

submitData.append(

  'allowed_entries',

  allowedEntries.toString()

);

      // IMPORTANT

      submitData.append(

        'event_id',

        id

      );

      if (paymentProof) {

        submitData.append(

          'payment_proof',

          paymentProof

        );

      }

      const response = await axios.post(

        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,

        submitData,

        {

          headers: {

            'Content-Type': 'multipart/form-data'

          }

        }

      );

      console.log('API RESPONSE:', response.data);

      setSubmitted(true);

      console.log('REGISTRATION SUCCESS');

    }

catch (error: any) {

  console.log('FULL ERROR:', error);

  console.log('ERROR RESPONSE:', error?.response);

  console.log('ERROR DATA:', error?.response?.data);

} finally {

      setSubmitting(false);

    }

  };

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

        Loading...

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

  // =====================================
  // SUCCESS
  // =====================================

  if (submitted) {

    return (

      <div className="
        min-h-screen
        bg-black
        flex
        items-center
        justify-center
        text-white
        text-center
        p-10
      ">

        <div>

          <h1 className="
            text-5xl
            font-black
            mb-5
          ">

            Registration Submitted ✅

          </h1>

          <p className="
            text-gray-400
            text-xl
          ">

            Wait for admin approval.

          </p>

        </div>

      </div>

    );

  }

  // =====================================
  // UI
  // =====================================

  return (

    <div className="
      min-h-screen
      bg-black
      text-white
      flex
      items-center
      justify-center
      p-10
    ">

      <form

        onSubmit={handleSubmit}

        className="
          bg-white/5
border-white/10
backdrop-blur-xl
hover:scale-105
transition          border
          border-white/10
          backdrop-blur-xl
          rounded-3xl
          p-10
          w-full
          max-w-2xl
        "
      >

        <h1 className="
          text-5xl
          font-black
          mb-3
        ">

          {event.title}

        </h1>

        <p className="
          text-gray-400
          mb-10
        ">

          Register for this event

        </p>

        {/* FULL NAME */}

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
            rounded-2xl
            bg-black/30
            border
            border-white/10
            mb-5
          "
        />

        {/* EMAIL */}

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
            rounded-2xl
            bg-black/30
            border
            border-white/10
            mb-5
          "
        />

        {/* PHONE */}

        <input

          type="text"

          name="phone_number"

          placeholder="Phone Number"

          value={formData.phone_number}

          onChange={handleChange}

          required

          className="
            w-full
            p-4
            rounded-2xl
            bg-black/30
            border
            border-white/10
            mb-5
          "
        />

        {/* TICKET */}

        <div className="
  grid
  md:grid-cols-3
  gap-5
  mb-8
">

  {/* SOLO */}

  <button

    type="button"

    onClick={() => {

      setFormData({

        ...formData,

        ticket_type: 'solo'

      });

      setTotalAmount(299);

      setAllowedEntries(1);

    }}

    className={`
      p-6
      rounded-3xl
      border
      transition
      text-left

      ${

        formData.ticket_type === 'solo'

        ? 'bg-violet-500 border-violet-400'

        : 'bg-white/5 border-white/10'

      }
    `}
  >

    <h3 className="
      text-2xl
      font-bold
      mb-2
    ">

      Solo

    </h3>

    <p className="
      text-gray-300
      mb-4
    ">

      Single Entry Pass

    </p>

    <h1 className="
      text-4xl
      font-black
    ">

      ₹299

    </h1>

  </button>

  {/* COUPLE */}

  <button

    type="button"

    onClick={() => {

      setFormData({

        ...formData,

        ticket_type: 'couple'

      });

      setTotalAmount(499);

      setAllowedEntries(2);

    }}

    className={`
      p-6
      rounded-3xl
      border
      transition
      text-left

      ${

        formData.ticket_type === 'couple'

        ? 'bg-pink-500 border-pink-400'

        : 'bg-white/5 border-white/10'

      }
    `}
  >

    <h3 className="
      text-2xl
      font-bold
      mb-2
    ">

      Couple

    </h3>

    <p className="
      text-gray-300
      mb-4
    ">

      Entry For Two

    </p>

    <h1 className="
      text-4xl
      font-black
    ">

      ₹499

    </h1>

  </button>

  {/* GROUP */}

  <button

    type="button"

    onClick={() => {

      setFormData({

        ...formData,

        ticket_type: 'group'

      });

      setTotalAmount(999);

      setAllowedEntries(5);

    }}

    className={`
      p-6
      rounded-3xl
      border
      transition
      text-left

      ${

        formData.ticket_type === 'group'

        ? 'bg-cyan-500 border-cyan-400'

        : 'bg-white/5 border-white/10'

      }
    `}
  >

    <h3 className="
      text-2xl
      font-bold
      mb-2
    ">

      Group

    </h3>

    <p className="
      text-gray-300
      mb-4
    ">

      Group Entry Pass

    </p>

    <h1 className="
      text-4xl
      font-black
    ">

      ₹999

    </h1>

  </button>

</div>

{/* PAYMENT BOX */}

<div className="
  bg-gradient-to-br
  from-violet-500/20
  to-pink-500/20
  border
  border-white/10
  rounded-3xl
  p-8
  mb-8
">

  <h2 className="
    text-3xl
    font-black
    mb-4
  ">

    Payment Details

  </h2>

  <div className="
    flex
    justify-between
    items-center
    mb-5
  ">

    <p className="
      text-xl
      text-gray-300
    ">

      Selected Plan

    </p>

    <h3 className="
      text-2xl
      font-bold
      capitalize
    ">

      {formData.ticket_type}

    </h3>

  </div>

  <div className="
    flex
    justify-between
    items-center
    mb-5
  ">

    <p className="
      text-xl
      text-gray-300
    ">

      Allowed Entries

    </p>

    <h3 className="
      text-2xl
      font-bold
    ">

      {allowedEntries}

    </h3>

  </div>

  <div className="
    flex
    justify-between
    items-center
  ">

    <p className="
      text-xl
      text-gray-300
    ">

      Total Amount

    </p>

    <h1 className="
      text-5xl
      font-black
      text-violet-300
    ">

      ₹{totalAmount}

    </h1>

  </div>

</div>

<div className="
  bg-white
  rounded-3xl
  p-6
  mb-8
  text-center
">

  <img

    src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay"

    alt="UPI QR"

    className="
      mx-auto
      rounded-2xl
    "
  />

  <p className="
    text-black
    mt-5
    font-bold
    text-lg
  ">

    Scan & Pay Using UPI

  </p>

</div>

        {/* PAYMENT PROOF */}

        <input

          type="file"

          accept="image/*"

          onChange={(e) =>

            setPaymentProof(

              e.target.files?.[0]

            )

          }

          required

          className="
            w-full
            mb-8
          "
        />

        {/* BUTTON */}

        <button

          type="submit"

          disabled={submitting}

          className="
            w-full
            bg-violet-500
            hover:bg-violet-600
            transition
            py-5
            rounded-2xl
            font-bold
            text-xl
          "
        >

          {

            submitting

              ? 'Submitting...'

              : 'Complete Registration'

          }

        </button>

      </form>

    </div>

  );

}