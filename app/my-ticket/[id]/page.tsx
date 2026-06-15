'use client';

import { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { useParams } from 'next/navigation';

export default function MyTicketPage() {
  const params = useParams();

  // ====================================
  // STATES
  // ====================================

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRaceDetails, setSelectedRaceDetails] = useState<any>(null);

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
          phone_number: phone,
          event_id: params.id
        }
      );

      setTickets(response.data.data);
    } catch (error) {
      console.log(error);
      alert('Tickets not found');
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // DOWNLOAD PDF
  // ====================================

  const downloadPDF = async (ticket: any) => {
    try {
      const pdf = new jsPDF();

      // BACKGROUND (Dark Violet Theme)
      pdf.setFillColor(15, 23, 42); // slate-900 equivalent
      pdf.rect(0, 0, 210, 297, 'F');

      // HEADER
      pdf.setFillColor(139, 92, 246); // violet-500
      pdf.rect(0, 0, 210, 40, 'F');

      // TITLE
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(26);
      pdf.text(
        ticket.title.toUpperCase(),
        105,
        20,
        { align: 'center' }
      );

      pdf.setFontSize(12);
      pdf.setTextColor(233, 213, 255); // violet-200
      pdf.text(
        `PASS FOR ${ticket.title.toUpperCase()}`,
        105,
        32,
        { align: 'center' }
      );

      // BODY SECTION (Bordered Box style)
      pdf.setDrawColor(139, 92, 246); // violet-500 border
      pdf.setLineWidth(0.5);
      pdf.rect(20, 50, 170, 80);

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      
      const startY = 60;
      const gap = 10;
      
      pdf.setTextColor(196, 181, 253); // violet-300 for labels
      pdf.text('Name:', 25, startY);
      pdf.text('Phone No:', 25, startY + gap);
      pdf.text('Amount Paid:', 25, startY + gap * 2);
      pdf.text('Ticket:', 25, startY + gap * 3);
      pdf.text('Venue:', 25, startY + gap * 4);
      pdf.text('Date:', 25, startY + gap * 5);
      
      pdf.setTextColor(255, 255, 255); // white for values
      pdf.text(ticket.full_name || 'N/A', 65, startY);
      pdf.text(ticket.phone_number || 'N/A', 65, startY + gap);
      pdf.text(`Rs ${ticket.total_amount || 0}`, 65, startY + gap * 2);
      pdf.text(`${ticket.ticket_type} (${ticket.allowed_entries} members)`, 65, startY + gap * 3);
      pdf.text(ticket.venue || 'N/A', 65, startY + gap * 4);
      pdf.text(new Date(ticket.event_date).toLocaleDateString(), 65, startY + gap * 5);

      // QR CODE BACKGROUND
      pdf.setFillColor(255, 255, 255);
      pdf.rect(50, 145, 110, 110, 'F');

      // QR CODE
      pdf.addImage(
        ticket.qr_code,
        'PNG',
        55,
        150,
        100,
        100
      );

      // FOOTER
      pdf.setTextColor(233, 213, 255); // violet-200
      pdf.setFontSize(14);
      pdf.text(
        'Show this pass at the entrance',
        105,
        275,
        { align: 'center' }
      );

      // SAVE
      pdf.save(`${ticket.title.replace(/\s+/g, '-')}-Pass.pdf`);
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
      <div className="w-full max-w-2xl">

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
              My Tickets
            </h1>
            <p className="
              text-gray-300
              text-lg
            ">
              View Your Event Passes
            </p>
          </div>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPhone(e.target.value)}
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
               shadow-violet-500/30
            "
          >
            {loading ? 'Loading...' : 'View My Tickets'}
          </button>
        </div>

        {/* TICKETS LIST */}
        {tickets && tickets.length > 0 && (
          <div className="mt-10 space-y-10">
            {tickets.map((ticket, index) => (
              <div key={index}>
                {ticket.payment_status === 'pending' ? (
                  <div className="
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
                    <p className="text-white text-lg font-bold mb-2">
                      Pass: {ticket.ticket_type}
                    </p>
                    <p className="text-gray-300">
                      Your payment is under admin verification.
                    </p>
                  </div>
                ) : (
                  <div className="
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
                      <h2 className="text-4xl font-bold">
                        {ticket.title}
                      </h2>
                      <p className="text-lg mt-2 font-semibold">
                        PASS FOR {ticket.title.toUpperCase()}
                      </p>
                    </div>

                    {/* BODY */}
                    <div className="p-10 text-center">
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
                        <p className="text-white text-lg">
                          <span className="text-violet-300 font-bold">Name:</span> {ticket.full_name}
                        </p>
                        <p className="text-white text-lg">
                          <span className="text-violet-300 font-bold">Phone No:</span> {ticket.phone_number}
                        </p>
                        <p className="text-white text-lg">
                          <span className="text-violet-300 font-bold">Amount Paid:</span> ₹{ticket.total_amount}
                        </p>
                        <p className="text-white text-lg">
                          <span className="text-violet-300 font-bold">Event:</span> {ticket.title}
                        </p>
                        <p className="text-white text-lg">
                          <span className="text-violet-300 font-bold">Ticket:</span> {ticket.ticket_type} ({ticket.allowed_entries} members)
                        </p>
                        <p className="text-white text-lg">
                          <span className="text-violet-300 font-bold">Venue:</span> {ticket.venue}
                        </p>
                        <p className="text-white text-lg">
                          <span className="text-violet-300 font-bold">Date:</span> {new Date(ticket.event_date).toLocaleDateString()}
                        </p>
                      </div>

                      {/* QR */}
                      {ticket.qr_code && (
                        <div className="
                          bg-white
                          inline-block
                          p-5
                          rounded-3xl
                        ">
                          <img
                            src={ticket.qr_code}
                            alt="QR Code"
                            className="w-52 h-52 md:w-72 md:h-72"
                          />
                        </div>
                      )}

                      {/* FOOTER */}
                      <p className="text-gray-300 mt-8 text-lg">
                        Show this pass at the entrance
                      </p>

                      {/* DOWNLOAD & DETAILS BUTTONS */}
                      <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
                        {ticket.qr_code && (
                          <button
                            onClick={() => downloadPDF(ticket)}
                            className="
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
                        )}

                        {ticket.category?.toLowerCase()?.trim() === 'marathon' && ticket.custom_pricing && (
                          <button
                            onClick={() => {
                              try {
                                const pricing = typeof ticket.custom_pricing === 'string' ? JSON.parse(ticket.custom_pricing) : ticket.custom_pricing;
                                const details = pricing.find((p: any) => p.name === ticket.ticket_type);
                                if (details) {
                                  setSelectedRaceDetails({
                                    ...details,
                                    bib_number: ticket.bib_number,
                                    ticket_type: ticket.ticket_type
                                  });
                                }
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            className="
                               w-full
                               md:w-auto
                               bg-cyan-500
                               hover:bg-cyan-600
                               text-black
                               font-bold
                               px-8
                               py-4
                               rounded-2xl
                               text-lg
                               transition
                               shadow-lg
                               shadow-cyan-500/30
                            "
                          >
                            View Race Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RACE DETAILS MODAL */}
      {selectedRaceDetails && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-5">
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[30px] p-8 md:p-10 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedRaceDetails(null)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition"
            >
              ✕
            </button>
            <h2 className="text-3xl font-black text-cyan-300 mb-6 border-b border-white/10 pb-4">
              {selectedRaceDetails.name} Race Guide
            </h2>
            
            <div className="space-y-6">
              {(() => {
                const waveSize = Number(selectedRaceDetails.wave_size || 100);
                const gapMins = Number(selectedRaceDetails.wave_gap_mins || 15);
                const baseNumber = parseInt((selectedRaceDetails.ticket_type || '1').match(/\d+/)?.[0] || '1') * 1000;
                
                const hasBib = !!selectedRaceDetails.bib_number;
                // Calculate Wave Index
                const waveIndex = hasBib ? Math.max(0, Math.floor((selectedRaceDetails.bib_number - baseNumber - 1) / waveSize)) : 0;
                const waveLetter = hasBib ? String.fromCharCode(65 + waveIndex) : 'TBD';
                
                // Calculate Times
                const baseStart = selectedRaceDetails.start_time ? new Date(selectedRaceDetails.start_time) : null;
                const myStart = baseStart ? new Date(baseStart.getTime() + (hasBib ? waveIndex * gapMins * 60000 : 0)) : null;
                const myReporting = myStart ? new Date(myStart.getTime() - 60 * 60000) : null;

                return (
                  <>
                    <div className="bg-cyan-900/30 p-6 rounded-2xl border border-cyan-500/50 flex justify-between items-center shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                      <div>
                        <h4 className="text-cyan-400 text-sm uppercase tracking-wider mb-1">Your Bib</h4>
                        <p className="text-4xl md:text-5xl font-black text-white">{hasBib ? `#${selectedRaceDetails.bib_number}` : 'Pending'}</p>
                      </div>
                      <div className="text-right">
                        <h4 className="text-cyan-400 text-sm uppercase tracking-wider mb-1">Your Wave</h4>
                        <p className="text-4xl md:text-5xl font-black text-white">Wave {waveLetter}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {myStart && (
                        <div className="bg-black/50 p-5 rounded-2xl border border-white/10">
                          <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-1">{hasBib ? 'Your Start Time' : 'Base Start Time'}</h4>
                          <p className="text-xl md:text-2xl font-bold text-white">{myStart.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      )}
                      {myReporting && (
                        <div className="bg-black/50 p-5 rounded-2xl border border-white/10">
                          <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-1">{hasBib ? 'Your Reporting Time' : 'Base Reporting Time'}</h4>
                          <p className="text-xl md:text-2xl font-bold text-white">{myReporting.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}

              {selectedRaceDetails.bib_collection && (
                <div>
                  <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Bib Collection</h4>
                  <p className="text-xl font-medium text-white">{selectedRaceDetails.bib_collection}</p>
                </div>
              )}
              {selectedRaceDetails.additional_info && (
                <div>
                  <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Important Info</h4>
                  <p className="text-lg text-white bg-white/5 p-4 rounded-xl border border-white/10">{selectedRaceDetails.additional_info}</p>
                </div>
              )}
              {selectedRaceDetails.route_map_url && (
                <div>
                  <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-3">Route Map</h4>
                  <img 
                    src={selectedRaceDetails.route_map_url} 
                    alt="Route Map" 
                    className="w-full rounded-2xl border border-white/10"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <a 
                    href={selectedRaceDetails.route_map_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block mt-3 text-cyan-400 hover:underline"
                  >
                    Open Image in New Tab
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}