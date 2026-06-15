'use client';

import { useEffect, useState, use } from 'react';
import axios from 'axios';
import { ShieldCheck } from 'lucide-react';

export default function RegisterPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);

  // =====================================
  // STATES
  // =====================================

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [totalAmount, setTotalAmount] = useState(0);
  const [allowedEntries, setAllowedEntries] = useState(0);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    emergency_contact_name: '',
    emergency_contact: '',
    blood_group: ''
  });

  const [quantities, setQuantities] = useState({
    solo: 0,
    couple: 0,
    group: 0,
    bulk: 0
  });

  const [customQuantities, setCustomQuantities] = useState<{ [key: string]: number }>({});

  const [activeSlabKey, setActiveSlabKey] = useState<string>('slab1');
  const [activeSlabName, setActiveSlabName] = useState<string>('Standard Ticket');

  // Dynamic price calculator
  useEffect(() => {
    if (!event) return;
    
    let amount = 0;
    let entries = 0;

    const isMarathon = event.category?.toLowerCase() === 'marathon';

    if (isMarathon && event.custom_pricing) {
      try {
        const customPricing = typeof event.custom_pricing === 'string' 
          ? JSON.parse(event.custom_pricing) 
          : event.custom_pricing;
          
        Object.keys(customQuantities).forEach(distanceName => {
          const qty = customQuantities[distanceName];
          if (qty > 0) {
            const distanceDef = customPricing.find((d: any) => d.name === distanceName);
            if (distanceDef) {
              const price = Number(distanceDef[activeSlabKey]) || 0;
              amount += qty * price;
              entries += qty * 1; // 1 entry per marathon ticket
            }
          }
        });
      } catch (e) {
        console.error("Error parsing custom pricing", e);
      }
    } else {
      const soloPrice = Number(event[`${activeSlabKey}_solo_price`]) || 0;
      amount += quantities.solo * soloPrice;
      entries += quantities.solo * 1;

      const couplePrice = Number(event[`${activeSlabKey}_couple_price`]) || 0;
      amount += quantities.couple * couplePrice;
      entries += quantities.couple * 2;

      const groupPrice = Number(event[`${activeSlabKey}_group_price`]) || 0;
      amount += quantities.group * groupPrice;
      entries += quantities.group * 4;

      const bulkPrice = Number(event.bulk_pass_price) || 0;
      amount += quantities.bulk * bulkPrice;
      entries += quantities.bulk * (Number(event.bulk_pass_entries) || 0);
    }

    setTotalAmount(amount);
    setAllowedEntries(entries);
  }, [quantities, customQuantities, activeSlabKey, event]);

  const [paymentProof, setPaymentProof] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSending, setOtpSending] = useState(false);

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
      const evt = response.data.event;
      setEvent(evt);

      // Determine Slab
      const now = new Date().getTime();
      let slabKey = 'slab1';
      let slabName = "Standard Ticket";

      if (evt.slab1_deadline && now <= new Date(evt.slab1_deadline).getTime()) {
        slabKey = 'slab1';
        slabName = "Early Bird (Slab 1)";
      } else if (evt.slab2_deadline && now <= new Date(evt.slab2_deadline).getTime()) {
        slabKey = 'slab2';
        slabName = "Regular (Slab 2)";
      } else if (evt.slab3_deadline && now <= new Date(evt.slab3_deadline).getTime()) {
        slabKey = 'slab3';
        slabName = "Late (Slab 3)";
      } else if (evt.slab3_solo_price) {
        slabKey = 'slab3';
        slabName = "Last Minute";
      }

      setActiveSlabKey(slabKey);
      setActiveSlabName(slabName);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // =====================================
  // HANDLE REGISTER
  // =====================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address!");
      return;
    }

    const parsePhone = (phone: string) => {
      let cleaned = phone.replace(/\D/g, '');
      if (cleaned.length === 12 && cleaned.startsWith('91')) {
        cleaned = cleaned.substring(2);
      }
      return cleaned;
    };

    const phoneRegex = /^[6-9]\d{9}$/;
    
    if (!phoneRegex.test(parsePhone(formData.phone_number))) {
      alert("Please enter a valid 10-digit Indian phone number!");
      return;
    }

    if (formData.emergency_contact && !phoneRegex.test(parsePhone(formData.emergency_contact))) {
      alert("Please enter a valid 10-digit Indian phone number for emergency contact!");
      return;
    }

    try {
      setSubmitting(true);

      const tickets = [];
      const isMarathon = event.category?.toLowerCase() === 'marathon';
      
      if (isMarathon) {
        Object.keys(customQuantities).forEach(key => {
          for (let i = 0; i < customQuantities[key]; i++) tickets.push(key);
        });
      } else {
        for (let i = 0; i < quantities.solo; i++) tickets.push('solo');
        for (let i = 0; i < quantities.couple; i++) tickets.push('couple');
        for (let i = 0; i < quantities.group; i++) tickets.push('group');
        for (let i = 0; i < quantities.bulk; i++) tickets.push('bulk');
      }

      if (tickets.length === 0) {
        alert("Please select at least one pass!");
        setSubmitting(false);
        return;
      }

      if (!paymentProof) {
        alert("Payment screenshot required!");
        setSubmitting(false);
        return;
      }

      // SEND OTP FIRST
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/send-otp`, {
        email: formData.email
      });

      if (response.data.success) {
        setShowOtpModal(true);
      }
    } catch (error: any) {
      console.log('FULL ERROR:', error);
      alert(error?.response?.data?.message || 'Failed to send verification code. Please check your email address.');
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================
  // HANDLE OTP VERIFY AND REGISTER
  // =====================================

  const handleVerifyAndRegister = async () => {
    try {
      setOtpSending(true);

      const tickets = [];
      const isMarathon = event.category?.toLowerCase() === 'marathon';
      
      if (isMarathon) {
        Object.keys(customQuantities).forEach(key => {
          for (let i = 0; i < customQuantities[key]; i++) tickets.push(key);
        });
      } else {
        for (let i = 0; i < quantities.solo; i++) tickets.push('solo');
        for (let i = 0; i < quantities.couple; i++) tickets.push('couple');
        for (let i = 0; i < quantities.group; i++) tickets.push('group');
        for (let i = 0; i < quantities.bulk; i++) tickets.push('bulk');
      }

      const submitData = new FormData();
      submitData.append('full_name', formData.full_name);
      submitData.append('email', formData.email);
      submitData.append('phone_number', formData.phone_number);
      submitData.append('emergency_contact_name', formData.emergency_contact_name);
      submitData.append('emergency_contact', formData.emergency_contact);
      submitData.append('blood_group', formData.blood_group);
      
      // We pass tickets array as JSON
      submitData.append('tickets', JSON.stringify(tickets));
      
      submitData.append('total_amount', totalAmount.toString());
      submitData.append('allowed_entries', allowedEntries.toString());
      submitData.append('event_id', id);
      submitData.append('otp', otp);

      if (paymentProof) {
        submitData.append('payment_proof', paymentProof);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        submitData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log('API RESPONSE:', response.data);
      setShowOtpModal(false);
      setSubmitted(true);
      console.log('REGISTRATION SUCCESS');

    } catch (error: any) {
      console.log('FULL ERROR:', error);
      alert(error?.response?.data?.message || 'Registration Failed');
    } finally {
      setOtpSending(false);
    }
  };

  // =====================================
  // UI HELPERS
  // =====================================

  const renderCounter = (type: 'solo' | 'couple' | 'group' | 'bulk', label: string, subtitle: string, price: number) => (
    <div className="flex justify-between items-center p-5 bg-white/5 border border-white/10 rounded-3xl mb-4 hover:bg-white/10 transition">
      <div>
        <h3 className="text-xl font-bold">{label}</h3>
        <p className="text-gray-400 text-sm">{subtitle} • ₹{price}</p>
      </div>
      <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl">
        <button 
          type="button" 
          onClick={() => setQuantities({...quantities, [type]: Math.max(0, quantities[type] - 1)})}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold transition"
        >
          -
        </button>
        <span className="text-xl font-bold w-4 text-center">{quantities[type]}</span>
        <button 
          type="button"
          onClick={() => setQuantities({...quantities, [type]: quantities[type] + 1})}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold transition"
        >
          +
        </button>
      </div>
    </div>
  );

  const renderCustomCounter = (distanceName: string, price: number) => {
    const qty = customQuantities[distanceName] || 0;
    return (
      <div key={distanceName} className="flex justify-between items-center p-5 bg-white/5 border border-white/10 rounded-3xl mb-4 hover:bg-white/10 transition">
        <div>
          <h3 className="text-xl font-bold">{distanceName}</h3>
          <p className="text-gray-400 text-sm">1 Member • ₹{price}</p>
        </div>
        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl">
          <button 
            type="button" 
            onClick={() => setCustomQuantities({...customQuantities, [distanceName]: Math.max(0, qty - 1)})}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold transition"
          >
            -
          </button>
          <span className="text-xl font-bold w-4 text-center">{qty}</span>
          <button 
            type="button"
            onClick={() => setCustomQuantities({...customQuantities, [distanceName]: qty + 1})}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold transition"
          >
            +
          </button>
        </div>
      </div>
    );
  };

  // =====================================
  // RENDER BLOCKS
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500 text-3xl font-bold">
        Event Not Found
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center p-10">
        <div>
          <h1 className="text-5xl font-black mb-5">Registration Submitted ✅</h1>
          <p className="text-gray-400 text-xl">Wait for admin approval.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 w-full max-w-2xl shadow-2xl"
      >
        <h1 className="text-5xl font-black mb-3">{event.title}</h1>
        <p className="text-gray-400 mb-10">Register for this event</p>

        {/* DETAILS */}
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
          className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-5 focus:ring-2 focus:ring-violet-500 outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-5 focus:ring-2 focus:ring-violet-500 outline-none"
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
          className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-5 focus:ring-2 focus:ring-violet-500 outline-none"
        />
        <input
          type="text"
          name="emergency_contact_name"
          placeholder="Emergency Contact Name"
          value={formData.emergency_contact_name}
          onChange={handleChange}
          required
          className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-5 focus:ring-2 focus:ring-violet-500 outline-none"
        />
        <input
          type="text"
          name="emergency_contact"
          placeholder="Emergency Contact Number"
          value={formData.emergency_contact}
          onChange={handleChange}
          required
          className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-5 focus:ring-2 focus:ring-violet-500 outline-none"
        />
        <input
          type="text"
          name="blood_group"
          placeholder="Blood Group"
          value={formData.blood_group}
          onChange={handleChange}
          required
          className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-8 focus:ring-2 focus:ring-violet-500 outline-none"
        />

        {/* TICKET SELECTION */}
        <div className="mb-4">
          <p className="text-gray-400 mb-2">Active Pricing Tier: <span className="text-cyan-300 font-bold">{activeSlabName}</span></p>
        </div>

        <div className="mb-8">
          {event.category?.toLowerCase() === 'marathon' && event.custom_pricing ? (
            (() => {
              try {
                const customPricing = typeof event.custom_pricing === 'string' ? JSON.parse(event.custom_pricing) : event.custom_pricing;
                return customPricing.map((d: any) => renderCustomCounter(d.name, Number(d[activeSlabKey]) || 0));
              } catch (e) {
                return <p className="text-red-500">Error loading custom tickets.</p>;
              }
            })()
          ) : (
            <>
              {renderCounter('solo', 'Solo Pass', '1 Member', Number(event[`${activeSlabKey}_solo_price`]) || 0)}
              {renderCounter('couple', 'Couple Pass', '2 Members', Number(event[`${activeSlabKey}_couple_price`]) || 0)}
              {renderCounter('group', 'Group Pass', '4 Members', Number(event[`${activeSlabKey}_group_price`]) || 0)}
              
              {event.bulk_pass_price && 
                renderCounter('bulk', 'Bulk Pass', `${event.bulk_pass_entries} Members`, Number(event.bulk_pass_price) || 0)
              }
            </>
          )}
        </div>

        {/* PAYMENT BOX */}
        <div className="bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-white/10 rounded-3xl p-8 mb-8">
          <h2 className="text-3xl font-black mb-4">Payment Details</h2>
          <div className="flex justify-between items-center mb-5">
            <p className="text-xl text-gray-300">Selected Plan</p>
            <h3 className="text-2xl font-bold capitalize">{activeSlabName}</h3>
          </div>
          <div className="flex justify-between items-center mb-5">
            <p className="text-xl text-gray-300">Allowed Entries</p>
            <h3 className="text-2xl font-bold">{allowedEntries}</h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xl text-gray-300">Total Amount</p>
            <h1 className="text-5xl font-black text-violet-300">₹{totalAmount}</h1>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 mb-8 text-center">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay"
            alt="UPI QR"
            className="mx-auto rounded-2xl"
          />
          <p className="text-black mt-5 font-bold text-lg">Scan & Pay Using UPI</p>
        </div>

        {/* PAYMENT PROOF */}
        <label className="block text-gray-400 mb-2 ml-2">Upload Payment Screenshot</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPaymentProof(e.target.files?.[0])}
          required
          className="w-full mb-8 text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-violet-500 file:text-white hover:file:bg-violet-600 transition cursor-pointer"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-violet-500 hover:bg-violet-600 transition py-5 rounded-2xl font-bold text-xl disabled:opacity-50"
        >
          {submitting ? 'Sending Verification Code...' : 'Complete Registration'}
        </button>
      </form>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-5">
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[30px] p-8 md:p-12 w-full max-w-md shadow-2xl relative">
            <button 
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white"
            >
              ✕
            </button>
            <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-cyan-500/30">
              <ShieldCheck size={32} className="text-cyan-400" />
            </div>
            <h2 className="text-3xl font-black text-center mb-2">Verify Your Email</h2>
            <p className="text-gray-400 text-center mb-8">We've sent a 6-digit code to <strong>{formData.email}</strong>. Please enter it below to confirm your registration.</p>
            
            <input 
              type="text" 
              placeholder="Enter 6-digit code" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-center text-2xl font-bold tracking-widest text-white outline-none focus:border-cyan-500 transition mb-6"
              maxLength={6}
            />
            
            <button 
              type="button"
              onClick={handleVerifyAndRegister}
              disabled={otpSending || otp.length < 6}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-4 rounded-2xl transition disabled:opacity-50"
            >
              {otpSending ? 'Verifying...' : 'Verify & Register'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}