'use client';

import { useEffect, useState, use } from 'react';
import axios from 'axios';
import Link from 'next/link';
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
    blood_group: '',
    gender: '',
    tshirt_size: ''
  });

  const [quantities, setQuantities] = useState<Record<string, number>>({
    solo: 0,
    couple: 0,
    group: 0,
    bulk: 0
  });

  const [participants, setParticipants] = useState<any[]>([]);

  const [step, setStep] = useState(1);

  const [activeSlabKey, setActiveSlabKey] = useState<string>('slab1');
  const [activeSlabName, setActiveSlabName] = useState<string>('Early Bird Offer');
  const [isClosed, setIsClosed] = useState<boolean>(false);

  // COUPON CODE STATES
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponMessage({ type: 'error', text: 'Please enter a coupon code.' });
      return;
    }

    if (!event || !event.coupons) {
      setCouponMessage({ type: 'error', text: 'Invalid coupon code.' });
      return;
    }

    let coupons = [];
    try {
      coupons = typeof event.coupons === 'string' ? JSON.parse(event.coupons) : (event.coupons || []);
    } catch(e) {
      coupons = [];
    }

    const match = coupons.find((c: any) => c.code && c.code.trim().toUpperCase() === couponInput.trim().toUpperCase());

    if (!match) {
      setAppliedCoupon(null);
      setCouponMessage({ type: 'error', text: `Invalid coupon code '${couponInput}'.` });
      return;
    }

    const maxUses = Number(match.max_uses) || 0;
    const currentUses = Number(match.used_count) || 0;

    if (maxUses > 0 && currentUses >= maxUses) {
      setAppliedCoupon(null);
      setCouponMessage({ type: 'error', text: `Offer is over for coupon '${match.code}' (limit of ${maxUses} members reached). Continuing with actual prices.` });
      return;
    }

    setAppliedCoupon(match);
    setCouponMessage({ type: 'success', text: `Coupon '${match.code}' applied! Special price ₹${match.price} per ticket.` });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponMessage(null);
  };

  // Dynamic price calculator
  useEffect(() => {
    if (!event) return;
    
    let amount = 0;
    let entries = 0;

    const isMarathon = event.category?.toLowerCase()?.trim() === 'marathon';

    if (isMarathon && event.custom_pricing) {
      try {
        const customPricing = typeof event.custom_pricing === 'string' 
          ? JSON.parse(event.custom_pricing) 
          : event.custom_pricing;
          
        customPricing.forEach((d: any) => {
          const qty = quantities[d.name] || 0;
          const price = appliedCoupon && Number(appliedCoupon.price) >= 0
            ? Number(appliedCoupon.price)
            : (Number(d[activeSlabKey]) || 0);
          amount += price * qty;
          entries += qty; // 1 entry per marathon ticket
        });
      } catch (e) {
        console.error("Error parsing custom pricing", e);
      }
    } else {
      const soloPrice = appliedCoupon && Number(appliedCoupon.price) >= 0 ? Number(appliedCoupon.price) : (Number(event[`${activeSlabKey}_solo_price`]) || 0);
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
  }, [quantities, activeSlabKey, event, appliedCoupon]);

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

      // Determine Slab and Registration Status
      const now = new Date().getTime();
      let slabKey = 'slab1';
      let slabName = "Early Bird Offer";
      let registrationClosed = false;

      // Check if all registration slab deadlines have passed
      const deadlines = [
        evt.slab3_deadline,
        evt.slab2_deadline,
        evt.slab1_deadline,
        evt.registration_deadline
      ].filter(Boolean).map((d: string) => new Date(d).getTime());

      if (deadlines.length > 0) {
        const latestDeadline = Math.max(...deadlines);
        if (now > latestDeadline) {
          registrationClosed = true;
        }
      }

      if (evt.slab1_deadline && now <= new Date(evt.slab1_deadline).getTime()) {
        slabKey = 'slab1';
        slabName = "Early Bird Offer";
      } else if (evt.slab2_deadline && now <= new Date(evt.slab2_deadline).getTime()) {
        slabKey = 'slab2';
        slabName = "Slab 1";
      } else if (evt.slab3_deadline && now <= new Date(evt.slab3_deadline).getTime()) {
        slabKey = 'slab3';
        slabName = "Slab 2";
      } else if (evt.slab3_solo_price) {
        slabKey = 'slab3';
        slabName = "Slab 2";
      }

      setActiveSlabKey(slabKey);
      setActiveSlabName(slabName);
      setIsClosed(registrationClosed);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleParticipantChange = (index: number, field: string, value: string) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
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

      const tickets: string[] = [];
      const isMarathon = event.category?.toLowerCase()?.trim() === 'marathon';
      
      if (isMarathon) {
        participants.forEach(p => tickets.push(p.ticket_type));
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

      const tickets: string[] = [];
      const isMarathon = event.category?.toLowerCase()?.trim() === 'marathon';
      
      if (isMarathon) {
        participants.forEach(p => tickets.push(p.ticket_type));
      } else {
        for (let i = 0; i < quantities.solo; i++) tickets.push('solo');
        for (let i = 0; i < quantities.couple; i++) tickets.push('couple');
        for (let i = 0; i < quantities.group; i++) tickets.push('group');
        for (let i = 0; i < quantities.bulk; i++) tickets.push('bulk');
      }

      const submitData = new FormData();
      submitData.append('full_name', formData.full_name || (isMarathon && participants.length > 0 ? participants[0].full_name : 'Group Purchaser'));
      submitData.append('email', formData.email);
      submitData.append('phone_number', formData.phone_number);
      submitData.append('emergency_contact_name', formData.emergency_contact_name);
      submitData.append('emergency_contact', formData.emergency_contact);
      submitData.append('blood_group', formData.blood_group || '');
      submitData.append('gender', formData.gender || '');
      submitData.append('tshirt_size', formData.tshirt_size || '');
      
      // We pass tickets array as JSON
      submitData.append('tickets', JSON.stringify(tickets));
      
      if (isMarathon) {
        submitData.append('participants', JSON.stringify(participants));
      }
      
      submitData.append('total_amount', totalAmount.toString());
      submitData.append('allowed_entries', allowedEntries.toString());
      submitData.append('event_id', id);
      submitData.append('otp', otp);
      if (appliedCoupon) {
        submitData.append('coupon_code', appliedCoupon.code);
      }

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

  const renderCounter = (type: string, label: string, subtitle: string, price: number) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 sm:p-5 bg-white/5 border border-white/10 rounded-3xl mb-4 hover:bg-white/10 transition">
      <div>
        <h3 className="text-lg sm:text-xl font-bold">{label}</h3>
        <p className="text-gray-400 text-xs sm:text-sm">{subtitle} • ₹{price}</p>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 bg-black/40 p-2 rounded-2xl self-end sm:self-auto">
        <button 
          type="button" 
          onClick={() => setQuantities({...quantities, [type]: Math.max(0, (quantities[type] || 0) - 1)})}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg sm:text-xl font-bold transition"
        >
          -
        </button>
        <span className="text-lg sm:text-xl font-bold w-4 text-center">{quantities[type] || 0}</span>
        <button 
          type="button"
          onClick={() => setQuantities({...quantities, [type]: (quantities[type] || 0) + 1})}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg sm:text-xl font-bold transition"
        >
          +
        </button>
      </div>
    </div>
  );



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
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center p-6">
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[40px] p-8 md:p-12 max-w-xl shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-green-500/30 text-green-400 font-black text-4xl">
            ✓
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-green-300 via-white to-cyan-300 bg-clip-text text-transparent">
            Registration Submitted Successfully! 🎉
          </h1>
          
          <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
            Your registration is currently pending admin payment verification.
          </p>

          <div className="bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-pink-500/10 border border-white/10 rounded-3xl p-6 mb-8 text-left space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📩</span>
              <div>
                <h4 className="font-bold text-white text-base">Confirmation Email</h4>
                <p className="text-sm text-gray-300 leading-snug">
                  Once approved by the admin, your official QR Pass ticket will be sent directly to your registered email ID.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 pt-3 border-t border-white/10">
              <span className="text-2xl">🎟️</span>
              <div>
                <h4 className="font-bold text-white text-base">Check In "View My Ticket" Section</h4>
                <p className="text-sm text-gray-300 leading-snug">
                  You can also check your ticket status anytime in the <strong className="text-cyan-300">View My Ticket</strong> section using your registered email or phone number.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <Link href={`/my-ticket/${event?.event_id || id}`}>
              <button className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 px-8 py-3.5 rounded-2xl font-bold text-lg text-white shadow-xl transition hover:scale-105">
                Go to Ticket Section 🎟️
              </button>
            </Link>
          </div>

          <div className="border-t border-white/10 pt-6 text-gray-400 text-xs md:text-sm">
            <p className="mb-1 text-gray-400">For more information or urgent queries, contact:</p>
            <p className="font-bold text-white text-base">Shravya Hebbar</p>
            <p className="text-cyan-400 font-medium mt-1">
              📧 <a href="mailto:rotaractyelahanka.events@gmail.com" className="hover:underline">rotaractyelahanka.events@gmail.com</a> | 📞 <a href="tel:9611444945" className="hover:underline">9611444945</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center p-6">
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[40px] p-8 md:p-14 max-w-xl shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <span className="text-4xl">🔒</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Online Registration Closed
          </h1>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Online registration for <strong className="text-white">{event.title}</strong> is now closed as the registration slab dates have ended.
          </p>

          <div className="bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 border border-yellow-500/40 rounded-3xl p-6 mb-8 text-yellow-200 shadow-lg">
            <h3 className="text-2xl font-black mb-2 flex items-center justify-center gap-2 text-yellow-300">
              <span>⚡</span> ON-SPOT REGISTRATION IS OPEN! <span>⚡</span>
            </h3>
            <p className="text-base text-gray-200">
              Don't worry! You can still register on-spot directly at the event venue.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6 text-gray-400 text-sm">
            <p className="mb-2">For on-spot registration queries, contact:</p>
            <p className="font-bold text-white text-base">Shravya Hebbar</p>
            <p className="text-cyan-400 font-medium mt-1">📧 <a href="mailto:rotaractyelahanka.events@gmail.com" className="hover:underline">rotaractyelahanka.events@gmail.com</a> | 📞 <a href="tel:9611444945" className="hover:underline">9611444945</a></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">
      {event?.category?.toLowerCase()?.trim() === 'marathon' && step === 1 ? (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 w-full max-w-3xl shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-black mb-3 text-cyan-300">Select Your Distance</h1>
          <p className="text-gray-400 mb-8 text-lg">Choose a category to view race details and proceed to registration.</p>
          
          <div className="space-y-6 mb-8">
            {event.custom_pricing ? (() => {
              try {
                const customPricing = typeof event.custom_pricing === 'string' ? JSON.parse(event.custom_pricing) : event.custom_pricing;
                return customPricing.map((d: any) => {
                  const price = appliedCoupon && Number(appliedCoupon.price) >= 0
                    ? Number(appliedCoupon.price)
                    : (Number(d[activeSlabKey]) || 0);
                  return (
                    <div key={d.name} className="p-6 md:p-8 rounded-3xl border-2 border-white/10 bg-black/40 mb-4">
                      {renderCounter(d.name, d.name, "1 Member", price)}
                    </div>
                  );
                });
              } catch (e) {
                return <p className="text-red-500">Error loading custom tickets.</p>;
              }
            })() : null}
          </div>

          {/* PARTNER / COUPON CODE BOX */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
            <label className="block text-sm font-bold text-cyan-300 mb-2">Have a Partner / Coupon Code?</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Enter the code" 
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="flex-1 p-3.5 rounded-xl bg-black/40 border border-white/10 text-white uppercase tracking-wider font-bold text-sm focus:border-cyan-500 outline-none"
              />
              <button 
                type="button"
                onClick={handleApplyCoupon}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-6 py-3.5 rounded-xl transition shadow-md"
              >
                Apply
              </button>
            </div>
            {couponMessage && (
              <div className={`mt-3 p-3 rounded-xl text-sm font-bold flex items-center justify-between ${couponMessage.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                <span>{couponMessage.text}</span>
                {appliedCoupon && (
                  <button 
                    type="button" 
                    onClick={handleRemoveCoupon} 
                    className="text-xs underline hover:text-white ml-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (totalAmount === 0 || allowedEntries === 0) return alert('Please add at least one ticket to your cart.');
              
              const newParticipants: any[] = [];
              Object.entries(quantities).forEach(([type, count]) => {
                if (count > 0) {
                  for (let i = 0; i < count; i++) {
                    newParticipants.push({
                      ticket_type: type,
                      full_name: '',
                      blood_group: '',
                      gender: '',
                      tshirt_size: ''
                    });
                  }
                }
              });
              setParticipants(newParticipants);
              setStep(2);
            }}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-black text-xl py-5 rounded-2xl transition shadow-[0_0_30px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={totalAmount === 0}
          >
            Proceed to Registration
          </button>
        </div>
      ) : (
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-10 w-full max-w-2xl shadow-2xl"
      >
        <h1 className="text-3xl sm:text-5xl font-black mb-3">{event.title}</h1>
        <p className="text-gray-400 mb-8 sm:mb-10 text-sm sm:text-base">Register for this event</p>

        {/* PRIMARY CONTACT DETAILS */}
        <h2 className="text-xl sm:text-2xl font-bold text-violet-300 mb-4 border-b border-white/10 pb-2">Primary Contact (Purchaser)</h2>
        
        {event.category?.toLowerCase()?.trim() !== 'marathon' && (
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-5 focus:ring-2 focus:ring-violet-500 outline-none"
          />
        )}
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
        {event.category?.toLowerCase()?.trim() !== 'marathon' && (
          <>
            <input
              type="text"
              name="blood_group"
              placeholder="Blood Group"
              value={formData.blood_group}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-5 focus:ring-2 focus:ring-violet-500 outline-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 focus:ring-2 focus:ring-violet-500 outline-none text-gray-300"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <select
                name="tshirt_size"
                value={formData.tshirt_size}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 focus:ring-2 focus:ring-violet-500 outline-none text-gray-300"
              >
                <option value="" disabled>T-Shirt Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          </>
        )}

        {/* PARTICIPANT DETAILS (MARATHON ONLY) */}
        {event.category?.toLowerCase()?.trim() === 'marathon' && participants.length > 0 && (
          <div className="mt-8 mb-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-300 mb-4 border-b border-white/10 pb-2">Participant Details</h2>
            {participants.map((p, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl">
                <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-300">Participant {i + 1} • <span className="text-cyan-400">{p.ticket_type}</span></h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={p.full_name}
                  onChange={(e) => handleParticipantChange(i, 'full_name', e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-black/30 border border-white/10 mb-4 focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={p.gender}
                    onChange={(e) => handleParticipantChange(i, 'gender', e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-black/30 border border-white/10 focus:ring-2 focus:ring-cyan-500 outline-none text-gray-300 text-sm"
                  >
                    <option value="" disabled>Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Blood Group"
                    value={p.blood_group}
                    onChange={(e) => handleParticipantChange(i, 'blood_group', e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-black/30 border border-white/10 focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                  />
                  <select
                    value={p.tshirt_size}
                    onChange={(e) => handleParticipantChange(i, 'tshirt_size', e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-black/30 border border-white/10 focus:ring-2 focus:ring-cyan-500 outline-none text-gray-300 text-sm"
                  >
                    <option value="" disabled>T-Shirt Size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* TICKET SELECTION OVERVIEW */}
        <div className="mb-4">
          <p className="text-gray-400 mb-2">Active Pricing Tier: <span className="text-cyan-300 font-bold">{activeSlabName}</span></p>
        </div>
        <div className="mb-8">
          {event.category?.toLowerCase()?.trim() === 'marathon' && event.custom_pricing ? (
            <div className="bg-cyan-900/20 border border-cyan-500/30 p-5 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-cyan-300 font-bold mb-1">Tickets in Cart</p>
                <h3 className="text-2xl font-black text-white">
                  {Object.entries(quantities).filter(([_, v]) => v > 0).map(([k, v]) => `${v}x ${k}`).join(', ')}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-cyan-400 hover:text-cyan-300 underline text-sm font-bold"
              >
                Change
              </button>
            </div>
          ) : (
            <>
              {renderCounter('solo', 'Solo Pass', '1 Member', Number(event[`${activeSlabKey}_solo_price`]) || 0)}
              {renderCounter('couple', 'Couple Pass', '2 Members', Number(event[`${activeSlabKey}_couple_price`]) || 0)}
              {renderCounter('group', 'Group Pass', '4 Members', Number(event[`${activeSlabKey}_group_price`]) || 0)}
              {(Number(event.bulk_pass_price) > 0) && renderCounter('bulk', 'Bulk Pass', `${event.bulk_pass_entries || 0} Members`, Number(event.bulk_pass_price) || 0)}
            </>
          )}
        </div>

        {/* PARTNER / COUPON CODE BOX */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <label className="block text-sm font-bold text-violet-300 mb-2">Have a Partner / Coupon Code?</label>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Enter the code" 
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              className="flex-1 p-3.5 rounded-xl bg-black/40 border border-white/10 text-white uppercase tracking-wider font-bold text-sm focus:border-violet-500 outline-none"
            />
            <button 
              type="button"
              onClick={handleApplyCoupon}
              className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-md"
            >
              Apply
            </button>
          </div>
          {couponMessage && (
            <div className={`mt-3 p-3 rounded-xl text-sm font-bold flex items-center justify-between ${couponMessage.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
              <span>{couponMessage.text}</span>
              {appliedCoupon && (
                <button 
                  type="button" 
                  onClick={handleRemoveCoupon} 
                  className="text-xs underline hover:text-white ml-2"
                >
                  Remove
                </button>
              )}
            </div>
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

        <div className="bg-white text-black rounded-3xl p-6 mb-8 text-center shadow-xl">
          <h3 className="text-xl font-black text-blue-900 mb-3 uppercase tracking-wider">Canara Bank Official Payment QR</h3>
          <div className="max-w-xs mx-auto bg-white p-2 rounded-2xl border border-gray-200">
            <img
              src="/payment-qr.jpg"
              alt="Canara Bank UPI Payment QR"
              className="mx-auto rounded-xl max-h-96 w-auto object-contain"
            />
          </div>
          <p className="text-gray-800 mt-4 font-bold text-lg">Scan & Pay Using Any UPI App</p>
          <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
            <p className="text-gray-600 font-medium">UPI ID: <span className="font-bold text-gray-900 select-all">anirudha26hindupur@cnrb</span></p>
            <p className="text-gray-600 font-medium mt-1">Account Name: <span className="font-bold text-gray-900">H GIRISH PRASAD</span></p>
          </div>
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
      )}
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