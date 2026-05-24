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

        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,

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
      bg-black
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
          bg-black
          border
          border-yellow-700
          rounded-3xl
          p-10
        ">

          {/* HEADING */}

          <div className="text-center mb-10">

            <h1 className="
              text-3xl md:text-5xl
              font-bold
              text-yellow-300
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
              rounded-xl
              bg-black
              border
              border-gray-700
              text-white
              placeholder-gray-400
              focus:outline-none
              focus:ring-2
              focus:ring-yellow-400
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
              mb-8
              rounded-xl
              bg-black
              border
              border-gray-700
              text-white
              placeholder-gray-400
              focus:outline-none
              focus:ring-2
              focus:ring-yellow-400
            "

          />




          {/* BUTTON */}

          <button

            onClick={getTicket}

            disabled={loading}

            className="
               w-full
               bg-yellow-400
               hover:bg-yellow-300
               text-black
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
              bg-black
              border
              border-yellow-700
              rounded-3xl
              p-10
              text-center
            ">

              <h2 className="
                text-3xl
                text-yellow-300
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
              bg-black
              border
              border-yellow-700
              rounded-3xl
              overflow-hidden
            ">

              {/* HEADER */}

              <div className="
                bg-yellow-400
                text-black
                text-center
                py-5
              ">

                <h2 className="
                  text-4xl
                  font-bold
                ">
                  MUSICAL JAM
                </h2>

                <p className="
                  text-lg
                  mt-2
                  font-semibold
                ">
                  PASS FOR MUSICAL NIGHT 🎵
                </p>

              </div>




              {/* BODY */}

              <div className="
                p-10
                text-center
              ">

                <h3 className="
                  text-3xl
                  text-yellow-300
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
                      text-yellow-300
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
                      text-yellow-300
                      font-bold
                    ">
                      Event:
                    </span>
                    {' '}
                    Musical Jam Night
                  </p>



                  <p className="
                    text-white
                    text-lg
                  ">
                    <span className="
                      text-yellow-300
                      font-bold
                    ">
                      Venue:
                    </span>
                    {' '}
                    Jamming Arena
                  </p>



                  <p className="
                    text-white
                    text-lg
                  ">
                    <span className="
                      text-yellow-300
                      font-bold
                    ">
                      Date:
                    </span>
                    {' '}
                    June 13, 2026
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
                     bg-yellow-400
                     hover:bg-yellow-300
                     text-black
                     font-bold
                     px-8
                     py-4
                     rounded-2xl
                     text-lg
                     transition
                     shadow-lg
                     shadow-yellow-500/30
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