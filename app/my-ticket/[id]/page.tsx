'use client';

import { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

export default function MyTicketPage() {

  // ====================================
  // STATES
  // ====================================

  const [email, setEmail] = useState('');

  const [phone, setPhone] = useState('');

  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(false);




  // ====================================
  // GET TICKET
  // ====================================

  const getTicket = async () => {

    try {

      setLoading(true);



      const response = await axios.post(

        `${process.env.NEXT_PUBLIC_API_URL}/api/my-ticket`,

        {

          email,

          phone_number: phone

        }

      );



      setUser(response.data.data);

    } catch (error) {

      console.log(error);

      alert('Ticket not found');

    } finally {

      setLoading(false);

    }

  };




  // ====================================
  // DOWNLOAD PDF
  // ====================================

  const downloadPDF = async () => {

    try {

      const pdf = new jsPDF();



      // BACKGROUND

      pdf.setFillColor(0, 0, 0);

      pdf.rect(0, 0, 210, 297, 'F');



      // HEADER

      pdf.setFillColor(255, 215, 0);

      pdf.rect(0, 0, 210, 40, 'F');



      // TITLE

      pdf.setTextColor(0, 0, 0);

      pdf.setFontSize(28);

      pdf.text(

        'MUSICAL JAM',

        55,

        20

      );



      pdf.setFontSize(14);

      pdf.text(

        'PASS FOR MUSICAL NIGHT',

        50,

        32

      );



      // BODY

      pdf.setTextColor(255, 255, 255);

      pdf.setFontSize(18);

      pdf.text(

        `Name: ${user.full_name}`,

        20,

        70

      );



      pdf.text(

        'Event: Musical Jam Night',

        20,

        90

      );



      pdf.text(

        'Venue: Jamming Arena',

        20,

        110

      );



      pdf.text(

        'Date: June 13, 2026',

        20,

        130

      );



      // QR CODE

      pdf.addImage(

        user.qr_code,

        'PNG',

        55,

        150,

        100,

        100

      );



      // FOOTER

      pdf.setFontSize(14);

      pdf.text(

        'Show this QR at the entrance',

        45,

        270

      );



      // SAVE

      pdf.save('Musical-Jam-Pass.pdf');

    } catch (error) {

      console.log(error);

      alert('PDF generation failed');

    }

  };




  // ====================================
  // MAIN RETURN
  // ====================================

  return (

   <div className="
  min-h-screen
  bg-gradient-to-br
  from-black
  via-zinc-950
  to-violet-950
  flex
  items-center
  justify-center
  px-5
  py-10
">

      <div className="
        w-full
        max-w-2xl
      ">

        {/* LOGIN BOX */}

        <div className="
  bg-white/5
  border
  border-white/10
  backdrop-blur-xl
  rounded-[35px]
  p-10
  ">

          {/* HEADING */}

          <div className="text-center mb-10">

            <h1 className="
              text-3xl md:text-5xl
              font-bold
              bg-gradient-to-r
              from-violet-300
              via-white
              to-pink-300
              bg-clip-text
              text-transparent
              mb-3
            ">
              My Ticket
            </h1>

            <p className="
              text-gray-300
              text-lg
            ">
              View Your Musical Jam Pass
            </p>

          </div>




          {/* EMAIL */}

          <input

            type="email"

            placeholder="Email Address"

            value={email}

            onChange={(e) =>

              setEmail(e.target.value)

            }

            className="
            w-full
            p-4
            mb-5
            rounded-[20px]
            bg-white/5
            border
            border-white/10
            backdrop-blur-xl
            text-white
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-violet-50
            "

          />




          {/* PHONE */}

          <input

            type="text"

            placeholder="Phone Number"

            value={phone}

            onChange={(e) =>

              setPhone(e.target.value)

            }

            className="
             w-full
             p-4
             mb-5
             rounded-[20px]
             bg-white/5
             border
             border-white/10
             backdrop-blur-xl
             text-white
             placeholder-gray-400
             focus:outline-none
             focus:ring-2
             focus:ring-violet-50
             "

          />




          {/* BUTTON */}

          <button

            onClick={getTicket}

            disabled={loading}

            className="
               w-full
              bg-violet-500
              hover:bg-violet-600
              text-white
               font-bold
               py-4
               px-6
               rounded-2xl
               text-lg
               transition
               shadow-lg
               shadow-yellow-500/30
            "

          >

            {

              loading

                ? 'Loading...'

                : 'View My Ticket'

            }

          </button>

        </div>




        {/* PENDING STATUS */}

        {

          user &&

          user.payment_status === 'pending' && (

            <div className="
              mt-10
              bg-white/5
              border-white/10
              backdrop-blur-xl
              border
              rounded-3xl
              p-10
              text-center
            ">

              <h2 className="
                text-3xl
                text-violet-300
                font-bold
                mb-5
              ">
                Waiting For Approval ⏳
              </h2>

              <p className="
                text-white
                text-lg
              ">
                Your payment is under admin verification.
              </p>

            </div>

          )

        }




        {/* APPROVED PASS */}

        {

          user &&

          user.payment_status === 'approved' && (

            <div className="
              mt-10
              bg-white/5
              border-white/10
              backdrop-blur-xl
              border
              rounded-3xl
              overflow-hidden
            ">

              {/* HEADER */}

              <div className="
                bg-violet-500
                text-white
                text-center
                py-5
              ">

                <h2 className="
                  text-4xl
                  font-bold
                ">
                  {user.title}
                </h2>

                <p className="
                  text-lg
                  mt-2
                  font-semibold
                ">
                  PASS FOR {user.title}
                </p>

              </div>




              {/* BODY */}

              <div className="
                p-10
                text-center
              ">

                <h3 className="
                  text-3xl
                  text-violet-300
                  font-bold
                  mb-8
                ">
                  Entry Pass
                </h3>




                {/* DETAILS */}

                <div className="
                  text-left
                  max-w-md
                  mx-auto
                  mb-8
                  space-y-4
                ">

                  <p className="
                    text-white
                    text-lg
                  ">
                    <span className="
                      text-violet-300
                      font-bold
                    ">
                      Name:
                    </span>
                    {' '}
                    {user.full_name}
                  </p>



                  <p className="
                    text-white
                    text-lg
                  ">
                    <span className="
                      text-violet-300
                      font-bold
                    ">
                      Event:
                    </span>
                    {' '}
                    {user.title}
                  </p>



                  <p className="
                    text-white
                    text-lg
                  ">
                    <span className="
                      text-violet-300
                      font-bold
                    ">
                      Venue:
                    </span>
                    {' '}
                    {user.venue}
                  </p>



                  <p className="
                    text-white
                    text-lg
                  ">
                    <span className="
                      text-violet-300
                      font-bold
                    ">
                      Date:
                    </span>
                    {' '}
                    {new Date(
                      user.event_date
                      ).toLocaleDateString()}
                  </p>

                </div>




                {/* QR */}

                <div className="
                  bg-white
                  inline-block
                  p-5
                  rounded-3xl
                ">

                  <img

                    src={user.qr_code}

                    alt="QR Code"

                    className="
                     w-52 h-52 md:w-72 md:h-72
                    "

                  />

                </div>




                {/* FOOTER */}

                <p className="
                  text-gray-300
                  mt-8
                  text-lg
                ">
                  Show this pass at the entrance
                </p>




                {/* DOWNLOAD */}

                <button

                  onClick={downloadPDF}

                  className="
                     mt-8
                     w-full
                     md:w-auto
                     bg-violet-500
                     hover:bg-violet-600
                     text-white
                     font-bold
                     px-8
                     py-4
                     rounded-2xl
                     text-lg
                     transition
                     shadow-lg
                     shadow-violet-500/30
                  "

                >
                  Download PDF Pass
                </button>

              </div>

            </div>

          )

        }

      </div>

    </div>

  );

}