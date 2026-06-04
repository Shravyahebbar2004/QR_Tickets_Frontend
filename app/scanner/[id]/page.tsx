'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ScannerPage() {

  const router = useRouter();

  const scannerRef = useRef<any>(null);

  const [scanResult, setScanResult] = useState<any>(null);




  // =====================================
  // AUTH CHECK
  // =====================================

  useEffect(() => {

    const token = localStorage.getItem(

      'scanner_token'

    );



    if (!token) {

      router.push('/scanner-login');

    }

  }, [router]);




  // =====================================
  // LOAD SCANNER
  // =====================================

  useEffect(() => {

    let scanner: any;



    const startScanner = async () => {

      const { Html5QrcodeScanner } = await import(

        'html5-qrcode'

      );



      scanner = new Html5QrcodeScanner(

        'reader',

        {

          fps: 5,

          qrbox: {

            width: 280,

            height: 280

          }

        },

        false

      );



      scanner.render(

        async (decodedText: string) => {

          try {

            const token = localStorage.getItem(

              'scanner_token'

            );



            const response = await axios.post(

              `${process.env.NEXT_PUBLIC_API_URL}/api/verify-ticket`,

              {

                qr_token: decodedText

              },

              {

                headers: {

                  Authorization:

                    `Bearer ${token}`

                }

              }

            );



            setScanResult(

              response.data

            );



          } catch (error) {

            console.log(error);

          }

        },

        (error: any) => {

          console.log(error);

        }

      );



      scannerRef.current = scanner;

    };



    startScanner();



    return () => {

      if (scannerRef.current) {

        scannerRef.current.clear()

          .catch(() => {});

      }

    };

  }, []);




  return (

  <main
    className="
      min-h-screen
      bg-gradient-to-br
      from-black
      via-zinc-950
      to-violet-950
      text-white
      p-6
      relative
      overflow-hidden
    "
  >

    {/* BACKGROUND GLOW */}

    <div className="
      absolute
      inset-0
      overflow-hidden
    ">

      <div className="
        absolute
        top-[-200px]
        left-[-200px]
        w-[500px]
        h-[500px]
        bg-violet-500/20
        blur-[180px]
        rounded-full
        animate-pulse
      "></div>

      <div className="
        absolute
        bottom-[-200px]
        right-[-200px]
        w-[500px]
        h-[500px]
        bg-cyan-500/20
        blur-[180px]
        rounded-full
        animate-pulse
      "></div>

    </div>

    <div className="relative z-10">

      {/* HEADER */}

      <div className="
        flex
        flex-col
        md:flex-row
        justify-between
        items-center
        gap-5
        mb-10
      ">

        <div>

          <h1
            className="
              text-5xl
              font-black
              bg-gradient-to-r
              from-cyan-300
              via-white
              to-violet-300
              bg-clip-text
              text-transparent
            "
          >
            QR Scanner
          </h1>

          <p
            className="
              text-gray-400
              mt-2
            "
          >
            EventFlow Verification Portal
          </p>

        </div>

        <button

          onClick={() => {

            localStorage.removeItem(

              'scanner_token'

            );

            router.push(

              '/scanner-login'

            );

          }}

          className="
            bg-red-500
            hover:bg-red-600
            px-6
            py-3
            rounded-2xl
            font-bold
            transition-all
          "

        >

          Logout

        </button>

      </div>

      {/* SCANNER CARD */}

      <div className="
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        rounded-[35px]
        p-6
        shadow-2xl
      ">

        <div id="reader"></div>

      </div>

      {/* RESULT */}

      {

        scanResult && (

          <div className="
            mt-10
          ">

            {

              scanResult.success

                ? (

                  <div className="
                    bg-green-500/10
                    border
                    border-green-500/30
                    backdrop-blur-xl
                    rounded-[35px]
                    p-10
                    text-center
                  ">

                    <h2 className="
                      text-5xl
                      font-black
                      text-green-400
                      mb-6
                    ">

                      ENTRY ALLOWED ✅

                    </h2>

                    <p className="
                      text-3xl
                      font-bold
                      mb-4
                    ">

                      {

                        scanResult.attendee.full_name

                      }

                    </p>

                    <p className="
                      text-xl
                      text-gray-300
                    ">

                      Ticket Type:

                      {' '}

                      {

                        scanResult.attendee.ticket_type

                      }

                    </p>

                    <p className="
                      text-xl
                      text-gray-300
                      mt-3
                    ">

                      Entries:

                      {' '}

                      {

                        scanResult.attendee.used_entries + 1

                      }

                      /

                      {

                        scanResult.attendee.allowed_entries

                      }

                    </p>

                  </div>

                )

                : (

                  <div className="
                    bg-red-500/10
                    border
                    border-red-500/30
                    backdrop-blur-xl
                    rounded-[35px]
                    p-10
                    text-center
                  ">

                    <h2 className="
                      text-5xl
                      font-black
                      text-red-400
                      mb-6
                    ">

                      ENTRY DENIED ❌

                    </h2>

                    <p className="
                      text-2xl
                      text-gray-300
                    ">

                      {

                        scanResult.message

                      }

                    </p>

                  </div>

                )

            }

          </div>

        )

      }

    </div>

  </main>

);

}