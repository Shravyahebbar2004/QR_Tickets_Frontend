'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CSVLink } from 'react-csv';

import {

  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer

} from 'recharts';

export default function AdminPage() {

  const router = useRouter();




  // ====================================
  // STATES
  // ====================================

  const [users, setUsers] = useState<any[]>([]);

  const [search, setSearch] = useState('');

  const [mounted, setMounted] = useState(false);

  const [analytics, setAnalytics] = useState<any>(null);




  // ====================================
  // FETCH USERS
  // ====================================

  const fetchUsers = async () => {

    try {

      const response = await axios.get(

        'http://localhost:5000/api/registrations'

      );

      setUsers(response.data.data);

    } catch (error) {

      console.log(error);

    }

  };




  // ====================================
  // FETCH ANALYTICS
  // ====================================

  const fetchAnalytics = async () => {

    try {

      const response = await axios.get(

        'http://localhost:5000/api/analytics'

      );



      setAnalytics(response.data);

    } catch (error) {

      console.log(error);

    }

  };




  // ====================================
  // APPROVE PAYMENT
  // ====================================

  const approvePayment = async (
    id: number
  ) => {

    try {

      await axios.post(

        `http://localhost:5000/api/approve-payment/${id}`

      );



      alert('Payment Approved & QR Sent');



      fetchUsers();

      fetchAnalytics();

    } catch (error) {

      console.log(error);

      alert('Approval Failed');

    }

  };




  // ====================================
  // AUTH CHECK + LIVE REFRESH
  // ====================================

  useEffect(() => {

    setMounted(true);

    const token = localStorage.getItem(

      'admin_token'

    );



    if (!token) {

      router.push('/admin-login');

      return;

    }



    fetchUsers();

    fetchAnalytics();



    const interval = setInterval(() => {

      fetchUsers();

      fetchAnalytics();

    }, 3000);



    return () => clearInterval(interval);

  }, [router]);




  // ====================================
  // ANALYTICS
  // ====================================

  const totalUsers = users.length;

  const approvedUsers = users.filter(

    (user: any) =>

      user.payment_status === 'approved'

  ).length;

  const pendingUsers = totalUsers - approvedUsers;




  // ====================================
  // SEARCH FILTER
  // ====================================

  const filteredUsers = users.filter(

    (user: any) => {

      return (

        user.full_name
          ?.toLowerCase()
          .includes(

            search.toLowerCase()

          )

        ||

        user.email
          ?.toLowerCase()
          .includes(

            search.toLowerCase()

          )

      );

    }

  );




  // ====================================
  // HYDRATION FIX
  // ====================================

  if (!mounted) {

    return null;

  }




  // ====================================
  // MAIN RETURN
  // ====================================

  return (

    <div className="
      min-h-screen
      bg-black
      text-white
      p-10
    ">

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

        <h1 className="
          text-5xl
          font-black
          text-yellow-300
        ">
          Admin Dashboard
        </h1>



        <div className="flex gap-4">

          {/* EXPORT CSV */}

          <CSVLink

            data={users}

            filename="attendees.csv"

            className="
              bg-green-500
              hover:bg-green-600
              px-6
              py-3
              rounded-xl
              font-bold
              transition
            "

          >
            Export CSV
          </CSVLink>



          {/* LOGOUT */}

          <button

            onClick={() => {

              localStorage.removeItem(

                'admin_token'

              );

              router.push('/admin-login');

            }}

            className="
              bg-red-500
              hover:bg-red-600
              px-6
              py-4
              rounded-2xl
              font-bold
              text-lg
              transition
              w-full
              md:w-auto
            "

          >
            Logout
          </button>

        </div>

      </div>




      {/* SEARCH */}

      <input

        type="text"

        placeholder="Search attendee by name or email..."

        value={search}

        onChange={(e) =>

          setSearch(e.target.value)

        }

        className="
          w-full
          mb-10
          p-4
          rounded-2xl
          bg-white/10
          border
          border-white/20
          text-white
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-yellow-400
        "

      />




      {/* ANALYTICS CARDS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
        mb-10
      ">

        {/* TOTAL */}

        <div className="
          bg-white/10
          border
          border-white/20
          rounded-3xl
          p-8
          text-center
          backdrop-blur-xl
        ">

          <h2 className="
            text-2xl
            text-gray-300
            mb-3
          ">
            Total Registrations
          </h2>

          <p className="
            text-5xl
            font-black
            text-yellow-300
          ">
            {totalUsers}
          </p>

        </div>




        {/* APPROVED */}

        <div className="
          bg-white/10
          border
          border-white/20
          rounded-3xl
          p-8
          text-center
          backdrop-blur-xl
        ">

          <h2 className="
            text-2xl
            text-gray-300
            mb-3
          ">
            Approved Tickets
          </h2>

          <p className="
            text-5xl
            font-black
            text-green-400
          ">
            {approvedUsers}
          </p>

        </div>




        {/* PENDING */}

        <div className="
          bg-white/10
          border
          border-white/20
          rounded-3xl
          p-8
          text-center
          backdrop-blur-xl
        ">

          <h2 className="
            text-2xl
            text-gray-300
            mb-3
          ">
            Pending Approvals
          </h2>

          <p className="
            text-5xl
            font-black
            text-red-400
          ">
            {pendingUsers}
          </p>

        </div>

      </div>




      {/* LIVE ANALYTICS GRAPH */}

      {

        analytics && (

          <div className="
            bg-white/10
            border
            border-white/10
            rounded-3xl
            p-10
            mb-10
            backdrop-blur-xl
          ">

            <h2 className="
              text-4xl
              font-black
              text-yellow-300
              mb-10
            ">
              Live Entry Analytics
            </h2>



            <ResponsiveContainer
              width="100%"
              height={400}
            >

              <LineChart
                data={analytics.hourlyEntries}
              >

                <XAxis dataKey="hour" />

                <YAxis />

                <Tooltip />

                <Line

                  type="monotone"

                  dataKey="entries"

                  stroke="#facc15"

                  strokeWidth={4}

                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        )

      }




      {/* RECENT ENTRIES */}

      {

        analytics && (

          <div className="
            bg-white/10
            border
            border-white/10
            rounded-3xl
            p-10
            mb-10
            backdrop-blur-xl
          ">

            <h2 className="
              text-4xl
              font-black
              text-yellow-300
              mb-8
            ">
              Recent Entries
            </h2>



            <div className="space-y-4">

              {

                analytics.recentEntries.map(

                  (

                    entry: any,

                    index: number

                  ) => (

                    <div

                      key={index}

                      className="
                        bg-black/40
                        border
                        border-white/10
                        rounded-2xl
                        p-5
                        flex
                        justify-between
                        items-center
                      "

                    >

                      <div>

                        <p className="
                          text-xl
                          font-bold
                        ">
                          {entry.full_name}
                        </p>

                        <p className="
                          text-gray-400
                        ">
                          Scanned by:
                          {' '}
                          {entry.username}
                        </p>

                      </div>



                      <p className="
                        text-yellow-300
                      ">

                        {

                          new Date(

                            entry.entry_time

                          ).toLocaleTimeString()

                        }

                      </p>

                    </div>

                  )

                )

              }

            </div>

          </div>

        )

      }




      {/* TABLE */}

      <div className="
        overflow-x-auto
        bg-white/10
        border
        border-white/20
        rounded-3xl
        backdrop-blur-xl
      ">

        <table className="
     w-full
  min-w-[1000px]
">  

          <thead>

            <tr className="
              bg-yellow-400
              text-black
            ">

              <th className="p-5">
                Name
              </th>

              <th className="p-5">
                Email
              </th>

              <th className="p-5">
                Phone
              </th>

              <th className="p-5">
                Ticket
              </th>

              <th className="p-5">
                Payment
              </th>

              <th className="p-5">
                Approval
              </th>

              <th className="p-5">
                Entries
              </th>

            </tr>

          </thead>




          <tbody>

            {

              filteredUsers.map(

                (user: any) => (

                  <tr

                    key={user.registration_id}

                    className="
                      text-center
                      border-t
                      border-white/10
                      hover:bg-white/5
                      transition
                    "

                  >

                    {/* NAME */}

                    <td className="p-5">

                      {user.full_name}

                    </td>




                    {/* EMAIL */}

                    <td className="p-5">

                      {user.email}

                    </td>




                    {/* PHONE */}

                    <td className="p-5">

                      {user.phone_number}

                    </td>




                    {/* TICKET */}

                    <td className="p-5">

                      <span className="
                        bg-yellow-400/10
                        text-yellow-300
                        px-4
                        py-2
                        rounded-xl
                        font-bold
                      ">

                        {user.ticket_type}

                      </span>

                    </td>




                    {/* PAYMENT IMAGE */}

                    <td className="p-5">

                      <img

                        src={`http://localhost:5000/uploads/${user.payment_proof}`}

                        alt="Payment Proof"

                        className="
                          w-24
                          rounded-xl
                          mx-auto
                          border
                          border-white/20
                        "

                      />

                    </td>




                    {/* APPROVAL */}

                    <td className="p-5">

                      {

                        user.payment_status === 'approved'

                          ? (

                            <span className="
                              text-green-400
                              font-bold
                            ">
                              Approved ✅
                            </span>

                          )

                          : (

                            <button

                              onClick={() =>

                                approvePayment(

                                  user.registration_id

                                )

                              }

                              className="
                                bg-green-500
                                hover:bg-green-600
                                px-6
                                py-4
                                rounded-2xl
                                font-bold
                                text-lg
                                transition
                                w-full
                                md:w-auto
                              "

                            >
                              Approve
                            </button>

                          )

                      }

                    </td>




                    {/* ENTRY COUNT */}

                    <td className="p-5">

                      <span className="
                        text-yellow-300
                        font-bold
                      ">

                        {

                          user.used_entries

                        }

                        /

                        {

                          user.allowed_entries

                        }

                      </span>

                    </td>

                  </tr>

                )

              )

            }

          </tbody>

        </table>

      </div>

    </div>

  );

}