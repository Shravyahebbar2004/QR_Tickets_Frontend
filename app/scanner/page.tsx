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

            width: 250,

            height: 250

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

              'http://localhost:5000/api/verify-ticket',

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

    <div className="
      min-h-screen
      bg-black
      text-white
      p-5
    ">

      {/* HEADER */}

      <div className="
        flex
        justify-between
        items-center
        mb-10
      ">

        <h1 className="
          text-5xl
          font-black
          text-yellow-300
        ">
          QR Scanner
        </h1>




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
            rounded-xl
            font-bold
          "

        >
          Logout
        </button>

      </div>




      {/* SCANNER */}

      <div className="
        max-w-2xl
        mx-auto
        bg-white/10
        border
        border-white/10
        rounded-3xl
        p-8
        backdrop-blur-xl
      ">

        <div id="reader"></div>

      </div>




      {/* RESULT */}

      {

        scanResult && (

          <div className="
            max-w-2xl
            mx-auto
            mt-10
          ">

            {

              scanResult.success

                ? (

                  <div className="
                    bg-green-500/10
                    border
                    border-green-500
                    rounded-3xl
                    p-10
                    text-center
                  ">

                    <h2 className="
                      text-5xl
                      font-black
                      text-green-400
                      mb-5
                    ">
                      ENTRY ALLOWED ✅
                    </h2>



                    <p className="
                      text-3xl
                      font-bold
                      mb-3
                    ">

                      {

                        scanResult.attendee.full_name

                      }

                    </p>



                    <p className="
                      text-xl
                      text-gray-300
                    ">

                      Ticket:
                      {' '}

                      {

                        scanResult.attendee.ticket_type

                      }

                    </p>



                    <p className="
                      text-xl
                      text-gray-300
                      mt-2
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
                    border-red-500
                    rounded-3xl
                    p-10
                    text-center
                  ">

                    <h2 className="
                      text-5xl
                      font-black
                      text-red-400
                      mb-5
                    ">
                      ENTRY DENIED ❌
                    </h2>



                    <p className="
                      text-2xl
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

  );

}