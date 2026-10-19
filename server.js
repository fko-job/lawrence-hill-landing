import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf8');
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }
  }
}));

// Inventory data extracted directly from official 2026-10-07 Price List
const INVENTORY = [
  {
    id: "unit-142",
    address: "69 Curlew Dr",
    unit: "142",
    level: "Main Level",
    type: "2 Bed (2.0 Bath)",
    category: "2bed",
    sqft: 781,
    exteriorSqft: 30,
    price: "$569,000",
    maintenance: "$178.60/mo",
    closing: "30–90 Days",
    deposit: "5% on Signing",
    inclusions: "Parking ($55K value) + Locker ($6K value) + $500 IKEA Card",
    floorplanImg: "/assets/images/floorplan-2bed-781sf.webp",
    features: ["Private Patio", "9ft Ceilings", "Solid Concrete STC 60", "Zero Levies"]
  },
  {
    id: "unit-149",
    address: "67 Curlew Dr",
    unit: "149 - SC",
    level: "Main Level",
    type: "2 Bed (2.0 Bath)",
    category: "2bed",
    sqft: 781,
    exteriorSqft: 30,
    price: "$569,000",
    maintenance: "$178.60/mo",
    closing: "30–90 Days",
    deposit: "5% on Signing",
    inclusions: "Parking ($55K value) + Locker ($6K value) + $500 IKEA Card",
    floorplanImg: "/assets/images/floorplan-2bed-781sf.webp",
    features: ["Special Collection", "Private Patio", "Solid Concrete STC 60", "Zero Levies"]
  },
  {
    id: "unit-182",
    address: "67 Curlew Dr",
    unit: "182",
    level: "Main Level",
    type: "2 Bed (2.0 Bath)",
    category: "2bed",
    sqft: 781,
    exteriorSqft: 30,
    price: "$569,000",
    maintenance: "$178.60/mo",
    closing: "30–90 Days",
    deposit: "5% on Signing",
    inclusions: "Parking ($55K value) + Locker ($6K value) + $500 IKEA Card",
    floorplanImg: "/assets/images/floorplan-2bed-781sf.webp",
    features: ["Private Garden Walkout", "Quartz Countertops", "Solid Concrete STC 60", "Zero Levies"]
  },
  {
    id: "unit-215",
    address: "65 Curlew Dr",
    unit: "215 - SC",
    level: "Main Level",
    type: "2 Bed (2.0 Bath)",
    category: "2bed",
    sqft: 781,
    exteriorSqft: 30,
    price: "$569,000",
    maintenance: "$178.60/mo",
    closing: "30–90 Days",
    deposit: "5% on Signing",
    inclusions: "Parking ($55K value) + Locker ($6K value) + $500 IKEA Card",
    floorplanImg: "/assets/images/floorplan-2bed-781sf.webp",
    features: ["Special Collection", "Immediate Occupancy", "Solid Concrete STC 60", "Zero Levies"]
  },
  {
    id: "unit-77",
    address: "71 Curlew Dr",
    unit: "77",
    level: "Main Level",
    type: "2 Bed (2.0 Bath)",
    category: "2bed",
    sqft: 781,
    exteriorSqft: 30,
    price: "$609,000",
    maintenance: "$178.60/mo",
    closing: "30–90 Days",
    deposit: "5% on Signing",
    inclusions: "Parking ($55K value) + Locker ($6K value) + $500 IKEA Card",
    floorplanImg: "/assets/images/floorplan-2bed-781sf.webp",
    features: ["Courtyard View", "Designer Finishes", "Solid Concrete STC 60", "Zero Levies"]
  },
  {
    id: "unit-172",
    address: "67 Curlew Dr",
    unit: "172",
    level: "Upper Level",
    type: "3 Bed (2.5 Bath)",
    category: "3bed",
    sqft: 1141,
    exteriorSqft: 300,
    price: "$649,000",
    maintenance: "$260.93/mo",
    closing: "30–90 Days",
    deposit: "5% on Signing",
    inclusions: "Parking ($55K value) + Locker ($6K value) + $500 IKEA Card",
    floorplanImg: "/assets/images/floorplan-3bed-1141sf.webp",
    features: ["Private Rooftop Terrace Oasis", "Gas BBQ Outlet", "Solid Concrete STC 60", "Zero Levies"]
  },
  {
    id: "unit-143",
    address: "69 Curlew Dr",
    unit: "143",
    level: "Upper Level",
    type: "3 Bed (2.5 Bath)",
    category: "3bed",
    sqft: 1141,
    exteriorSqft: 300,
    price: "$659,000",
    maintenance: "$260.93/mo",
    closing: "30–90 Days",
    deposit: "5% on Signing",
    inclusions: "Parking ($55K value) + Locker ($6K value) + $500 IKEA Card",
    floorplanImg: "/assets/images/floorplan-3bed-1141sf.webp",
    features: ["Expansive Rooftop Terrace", "Park View", "Solid Concrete STC 60", "Zero Levies"]
  },
  {
    id: "unit-156",
    address: "67 Curlew Dr",
    unit: "156",
    level: "Upper Level",
    type: "3 Bed (2.5 Bath)",
    category: "3bed",
    sqft: 1141,
    exteriorSqft: 300,
    price: "$669,000",
    maintenance: "$260.93/mo",
    closing: "30–90 Days",
    deposit: "5% on Signing",
    inclusions: "Parking ($55K value) + Locker ($6K value) + $500 IKEA Card",
    floorplanImg: "/assets/images/floorplan-3bed-1141sf.webp",
    features: ["Rooftop Deck & Balcony", "Double Vanity Ensuite", "Solid Concrete STC 60", "Zero Levies"]
  },
  {
    id: "unit-124",
    address: "69 Curlew Dr",
    unit: "124 - SC",
    level: "Upper Level",
    type: "3 Bed (2.5 Bath Corner)",
    category: "corner",
    sqft: 1196,
    exteriorSqft: 320,
    price: "$655,000",
    maintenance: "$273.50/mo",
    closing: "30–90 Days",
    deposit: "5% on Signing",
    inclusions: "Parking ($55K value) + Locker ($6K value) + $500 IKEA Card",
    floorplanImg: "/assets/images/floorplan-3bed-1196sf.webp",
    features: ["Corner Elevation Light", "320 SF Rooftop Terrace", "Solid Concrete STC 60", "Zero Levies"]
  },
  {
    id: "unit-147",
    address: "67 Curlew Dr",
    unit: "147",
    level: "Upper Level",
    type: "3 Bed (2.5 Bath Corner)",
    category: "corner",
    sqft: 1196,
    exteriorSqft: 320,
    price: "$699,000",
    maintenance: "$273.50/mo",
    closing: "30–90 Days",
    deposit: "5% on Signing",
    inclusions: "Parking ($55K value) + Locker ($6K value) + $500 IKEA Card",
    floorplanImg: "/assets/images/floorplan-3bed-1196sf.webp",
    features: ["Premium Corner Unit", "Over 1,500 SF Total Space", "Solid Concrete STC 60", "Zero Levies"]
  }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'Lawrence Hill Luxury Urban Towns', timestamp: new Date().toISOString() });
});

// Inventory Endpoint
app.get('/api/inventory', (req, res) => {
  res.json(INVENTORY);
});

// --- Follow Up Boss CRM Integration ---
const FUB_ENDPOINT = process.env.FUB_ENDPOINT || 'https://api.followupboss.com/v1/events';
const FUB_API_KEY = process.env.FUB_API_KEY;
const FUB_SYSTEM = process.env.FUB_SYSTEM || 'jeffreyshew-website';
const FUB_ASSIGNED_USER_ID = process.env.FUB_ASSIGNED_USER_ID ? Number(process.env.FUB_ASSIGNED_USER_ID) : 1;
const FUB_ASSIGNED_TO = process.env.FUB_ASSIGNED_TO || 'Jeffrey Shew';

async function postToFub(eventData) {
  if (!FUB_API_KEY) {
    console.warn('[Follow Up Boss] FUB_API_KEY not configured, skipping CRM sync.');
    return { skipped: true };
  }

  const auth = Buffer.from(`${FUB_API_KEY}:`).toString('base64');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Basic ${auth}`,
    'X-System': FUB_SYSTEM
  };
  if (process.env.FUB_SYSTEM_KEY) {
    headers['X-System-Key'] = process.env.FUB_SYSTEM_KEY;
  }

  try {
    const res = await fetch(FUB_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(eventData)
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[Follow Up Boss] Error (${res.status}): ${errText.slice(0, 300)}`);
      return { success: false, status: res.status, error: errText };
    }

    const data = await res.json().catch(() => ({}));
    console.log(`[Follow Up Boss] Event synced: ${eventData.person?.emails?.[0]?.value} | Tags: ${(eventData.person?.tags || []).join(', ')}`);
    return { success: true, data };
  } catch (err) {
    console.error('[Follow Up Boss] Network/Dispatch error:', err.message);
    return { success: false, error: err.message };
  }
}

// Zero-Loss Lead Persistence Endpoint
// Newsletter Subscription Endpoint
app.post("/api/newsletter", (req, res) => {
  try {
    const { name, email, interests } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email address is required." });
    }

    const subscriberRecord = {
      id: "sub_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      fullName: (name || "Anonymous Investor").trim(),
      email: email.trim().toLowerCase(),
      type: "NEWSLETTER_SUBSCRIBER",
      interests: interests || ["Pre-Construction", "Real Estate Investing", "Off-Market Allocations"],
      source: "Lawrence Hill Investor Newsletter",
      status: "SUBSCRIBED"
    };

    let existingLeads = [];
    try {
      existingLeads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf8"));
    } catch (e) {
      existingLeads = [];
    }

    existingLeads.push(subscriberRecord);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(existingLeads, null, 2), "utf8");

    console.log("[Newsletter Subscriber] " + subscriberRecord.fullName + " | " + subscriberRecord.email);

    // Sync with Follow Up Boss
    const nameParts = (name || "Subscriber").trim().split(/\s+/);
    const firstName = nameParts[0] || "Subscriber";
    const lastName = nameParts.slice(1).join(" ") || "";

    const fubPayload = {
      source: "Lawrence Hill Urban Towns Landing Page",
      system: FUB_SYSTEM,
      type: "Registration",
      message: `Newsletter Subscription: Private Investor Briefing · Interests: ${(interests || []).join(", ") || "Pre-Construction, Investing"}`,
      description: "Subscribed to Jeffrey Shew's Private Pre-Construction & Investor Briefing",
      pageUrl: "https://jeffreyshew.com/lawrence-hill/",
      person: {
        firstName,
        lastName,
        emails: [{ value: email.trim().toLowerCase(), type: "home" }],
        assignedUserId: FUB_ASSIGNED_USER_ID,
        assignedTo: FUB_ASSIGNED_TO,
        tags: ["Lawrence Hill", "Newsletter Subscriber", "Weekly-Newsletter-Updates", "Investor Briefing"]
      }
    };

    postToFub(fubPayload).catch(err => {
      console.error("[Follow Up Boss] Newsletter dispatch error:", err);
    });

    res.status(201).json({
      success: true,
      subscriberId: subscriberRecord.id,
      message: "Successfully subscribed to the Private Investor & Pre-Construction Briefing."
    });
  } catch (err) {
    console.error("Error recording newsletter subscription:", err);
    res.status(500).json({ error: "Internal server error processing subscription." });
  }
});


// --- Halloween open house raffle: one registration per person + confirmation email ---
const RAFFLE_FROM = Date.parse('2026-10-24T00:00:00-04:00'); // open house days, Toronto time
const RAFFLE_TO = Date.parse('2026-10-26T00:00:00-04:00');
const normPhone = (p) => String(p || '').replace(/\D/g, '').slice(-10);
const ENTRY_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newEntryId(leads) {
  const taken = new Set(leads.map((l) => l.raffleEntryId));
  let id;
  do {
    id = 'LH-HW-' + Array.from({ length: 5 }, () => ENTRY_CHARS[crypto.randomInt(ENTRY_CHARS.length)]).join('');
  } while (taken.has(id));
  return id;
}

// Needs SMTP_HOST, SMTP_USER, SMTP_PASS (+ optional SMTP_PORT, MAIL_FROM) in .env; without them no email is sent.
const mailer = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      requireTLS: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    })
  : null;

async function sendRaffleConfirmation(lead) {
  if (!mailer) {
    console.warn('[Mail] SMTP not configured, confirmation email skipped for', lead.raffleEntryId);
    return false;
  }
  const first = (lead.fullName || '').split(/\s+/)[0] || 'there';
  const text = `Hi ${first},

You're registered for the Lawrence Hill Halloween Open House.

Registration number: ${lead.raffleEntryId}
When: October 24 and 25, 12:30 PM to 4:00 PM
Where: Model Suites 62 & 63, 73 Curlew Drive, North York

Guests who register and attend the open house are entered in a draw for a $100 gift card. The draw takes place the first week of November. Conditions apply. Each person can register once.

Jeffrey Shew, Broker
647-503-2768 | jeffreyshew.com`;
  try {
    await mailer.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      replyTo: process.env.SMTP_USER,
      to: lead.email,
      subject: "You're registered: Lawrence Hill Halloween Open House (Oct 24 & 25)",
      text
    });
    return true;
  } catch (err) {
    console.error('[Mail] Confirmation failed:', err.message);
    return false;
  }
}

app.post('/api/leads', (req, res) => {
  try {
    const {
      fullName,
      firstName: inputFirstName,
      lastName: inputLastName,
      email,
      phone,
      suiteInterest,
      suitePreference,
      realtorStatus,
      budgetRange,
      timeline,
      buyerType,
      preferredTourDate,
      requestPDI,
      requestIncentives,
      notes,
      subscribeNewsletter,
      isOpenHouse,
      source
    } = req.body;

    const resolvedFullName = (fullName || `${inputFirstName || ''} ${inputLastName || ''}`).trim();

    if (!resolvedFullName || !email || !phone) {
      return res.status(400).json({ error: 'Missing required contact details (Name, Email, Phone).' });
    }

    const isOH = Boolean(isOpenHouse) || (source && source.includes('Open House'));
    const chosenSuite = suitePreference || suiteInterest || 'Model Suite 62 (2 Bed · 781 SF · $569K)';
    const isSubscribedNewsletter = Boolean(subscribeNewsletter);

    // Halloween raffle: ONE record per person (same email or phone) shared by both entry routes:
    //  - pop-up registration ("Halloween RSVP...", before the event) = registered
    //  - QR check-in at the venue on Oct 24-25 = registered AND attended
    // A registered person who later checks in by QR is marked attended on the same record.
    // Repeat attempts are not saved, not sent to the CRM and get no second email (no mail-bombing a stranger).
    const isPopupRsvp = typeof source === 'string' && source.startsWith('Halloween RSVP');
    const duringEvent = Date.now() >= RAFFLE_FROM && Date.now() < RAFFLE_TO;
    const attendedNow = Boolean(isOH) && !isPopupRsvp && duringEvent;
    let raffleEntryId = null;
    if (isPopupRsvp || attendedNow) {
      let all = [];
      try { all = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); } catch (e) { all = []; }
      const em = email.trim().toLowerCase();
      const ph = normPhone(phone);
      const prior = all.find((l) => l.raffleEntryId && (l.email === em || (ph.length >= 7 && normPhone(l.phone) === ph)));
      if (prior) {
        if (attendedNow && !prior.presentAt) {
          prior.presentAt = new Date().toISOString();
          fs.writeFileSync(LEADS_FILE, JSON.stringify(all, null, 2), 'utf8');
          broadcastLeadUpdate(prior);
          return res.status(200).json({ success: true, checkedIn: true, raffle: { entryId: prior.raffleEntryId } });
        }
        return res.status(200).json({ success: true, duplicate: true });
      }
      raffleEntryId = newEntryId(all);
    }

    // Follow Up Boss Tags:
    let tags = [];
    if (isOH) {
      tags = ['Lawrence Hill', 'Open House Attendee', 'Model Suite 62'];
      if (timeline) {
        tags.push(`Timeline: ${timeline}`);
        if (timeline.includes('Immediate')) {
          tags.push('Immediate Buyer');
        }
      }
      if (realtorStatus && (realtorStatus.includes('Licensed Realtor') || realtorStatus.includes('representation') || realtorStatus.includes('Realtor'))) {
        tags.push('Realtor-Represented');
      }
    } else {
      tags = ['Lawrence Hill', 'VIP Tour Inquiry'];
      if (timeline) {
        tags.push(`Timeline: ${timeline}`);
      }
    }
    
    if (isPopupRsvp) tags = tags.map((t) => (t === 'Open House Attendee' ? 'Open House RSVP' : t));
    if (raffleEntryId) tags.push('Halloween RSVP');

    // Tag identifying newsletter subscription:
    if (isSubscribedNewsletter) {
      tags.push('Newsletter Subscriber', 'Weekly-Newsletter-Updates');
    }

    const leadRecord = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      fullName: resolvedFullName,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      suiteInterest: chosenSuite,
      realtorStatus: realtorStatus || 'No Realtor / Direct Buyer',
      budgetRange: budgetRange || null,
      timeline: timeline || '30–90 Days',
      buyerType: buyerType || (isOH ? 'Open House Visitor' : 'End-User / First-Time Buyer'),
      preferredTourDate: preferredTourDate || (isOH ? 'Open House Today' : 'Flexible / Weekend'),
      requestPDI: Boolean(requestPDI),
      requestIncentives: Boolean(requestIncentives),
      subscribeNewsletter: isSubscribedNewsletter,
      isOpenHouse: isOH,
      source: source || (isOH ? 'Open House QR Check-In' : 'Direct Contact Form'),
      tags: tags,
      notes: (notes || '').trim(),
      depositStructure: '5% on Signing',
      closingWindow: '30 to 90 Days',
      modelSuiteLocation: '73 Curlew Dr, Units 62 & 63',
      status: isOH ? 'OPEN_HOUSE_SIGNIN' : 'NEW_VIP_INQUIRY',
      ...(raffleEntryId && { raffleEntryId, raffleEnrolledAt: new Date().toISOString(), ...(attendedNow && { presentAt: new Date().toISOString() }) })
    };

    // Durable atomic append to leads.json
    let existingLeads = [];
    try {
      const fileData = fs.readFileSync(LEADS_FILE, 'utf8');
      existingLeads = JSON.parse(fileData);
    } catch (e) {
      existingLeads = [];
    }

    existingLeads.push(leadRecord);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(existingLeads, null, 2), 'utf8');

    if (isOH) { broadcastOpenHouseAttendee(leadRecord); }
    console.log(`[Lead Captured] ID: ${leadRecord.id} | ${leadRecord.fullName} | ${leadRecord.email} | OpenHouse: ${isOH} | Newsletter: ${isSubscribedNewsletter} | Tags: ${tags.join(', ')}`);

    // Parse names for Follow Up Boss
    let firstName = inputFirstName ? inputFirstName.trim() : '';
    let lastName = inputLastName ? inputLastName.trim() : '';
    if (!firstName) {
      const nameParts = resolvedFullName.split(/\s+/);
      firstName = nameParts[0] || 'Guest';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    // Follow Up Boss Timeframe mapping
    const TIMELINE_TO_TIMEFRAME_ID = {
      'Immediate (30–90 Days)': 1,
      '3 to 6 Months': 2,
      '6 to 12+ Months': 3,
      'Curious Neighbour / Just Browsing': 5
    };
    const timeframeId = timeline ? TIMELINE_TO_TIMEFRAME_ID[timeline] : (isOH ? 1 : undefined);

    const personObj = {
      firstName,
      lastName,
      emails: [{ value: email.trim().toLowerCase(), type: 'home' }],
      phones: [{ value: phone.trim(), type: 'home' }],
      assignedUserId: FUB_ASSIGNED_USER_ID,
      assignedTo: FUB_ASSIGNED_TO,
      tags
    };
    if (timeframeId) {
      personObj.timeframeId = timeframeId;
    }

    // Build FUB Event payload
    const fubPayload = {
      source: isOH ? 'Lawrence Hill Open House' : 'Lawrence Hill Urban Towns Landing Page',
      system: FUB_SYSTEM,
      type: isOH ? 'Open House Registration' : 'Property Inquiry',
      message: isOH 
        ? `Open House Guest · Model Suite 62 · Timeline: ${timeline || 'Immediate'} · Budget: ${budgetRange || 'Not Specified'} · Realtor Status: ${realtorStatus || 'Direct Buyer'} · Newsletter: ${isSubscribedNewsletter ? 'Yes' : 'No'}`
        : `Suite Interest: ${chosenSuite} · Realtor Status: ${realtorStatus || 'Direct Buyer'} · Newsletter: ${isSubscribedNewsletter ? 'Subscribed' : 'No'}`,
      description: isOH
        ? `Lawrence Hill Open House Check-In (Model Suite 62 · 73 Curlew Dr) · Timeline: ${timeline || 'Immediate'} · Budget: ${budgetRange || 'Flexible'} · ${isSubscribedNewsletter ? 'Newsletter Subscribed' : 'Guest Sign-In'}`
        : `Lawrence Hill VIP Inquiry · Model Suite 62 · ${isSubscribedNewsletter ? 'Subscribed to Newsletter' : 'Standard Inquiry'}`,
      pageUrl: 'https://jeffreyshew.com/lawrence-hill/' + (isOH ? '?openhouse=true' : ''),
      person: personObj
    };

    // Dispatch asynchronously to Follow Up Boss without delaying client response
    postToFub(fubPayload).catch(err => {
      console.error('[Follow Up Boss] Background post error:', err);
    });

    if (raffleEntryId) {
      sendRaffleConfirmation(leadRecord).then((sent) => {
        if (!sent) return;
        try {
          const all = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
          const l = all.find((x) => x.id === leadRecord.id);
          if (l) { l.raffleConfirmationSentAt = new Date().toISOString(); fs.writeFileSync(LEADS_FILE, JSON.stringify(all, null, 2), 'utf8'); }
        } catch (e) { console.error('[Mail] Could not record confirmation time:', e.message); }
      });
    }

    return res.status(201).json({
      success: true,
      raffle: raffleEntryId ? { entryId: raffleEntryId, emailing: Boolean(mailer), attended: attendedNow } : undefined,
      leadId: leadRecord.id,
      isOpenHouse: isOH,
      subscribedNewsletter: isSubscribedNewsletter,
      tags: tags,
      message: isOH ? 'Open House sign-in registered. Welcome to Model Suite 62!' : 'Your VIP allocation request and private tour inquiry has been securely registered.',
      details: {
        modelSuiteAddress: '73 Curlew Dr, Units 62 & 63, North York',
        deposit: '5% on Signing',
        closingRange: '30 to 90 Days',
        incentivesLocked: '$0 Levies, $0 Meter Fees, Free Parking, Free Locker, $500 IKEA Card'
      }
    });
  } catch (error) {
    console.error('Error saving lead:', error);
    return res.status(500).json({ error: 'Internal server error while saving lead.' });
  }
});


// --- Private Open House Portal (Protected by HTTP Basic Auth) ---
const OPENHOUSE_ADMIN_USER = process.env.OPENHOUSE_ADMIN_USER || 'jeffrey';
// In-Memory Push Subscribers (Server-Sent Events)
const sseClients = new Set();

function broadcastLeadUpdate(attendee) {
  const payload = `data: ${JSON.stringify({ type: 'lead_updated', attendee })}\n\n`;
  for (const client of sseClients) {
    try { client.write(payload); } catch (err) { sseClients.delete(client); }
  }
}

function broadcastOpenHouseAttendee(attendee) {
  const payload = `data: ${JSON.stringify({ type: 'new_attendee', attendee })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (err) {
      sseClients.delete(client);
    }
  }
}
const OPENHOUSE_ADMIN_PASS = process.env.OPENHOUSE_ADMIN_PASS;
if (!OPENHOUSE_ADMIN_PASS) throw new Error('OPENHOUSE_ADMIN_PASS must be set in .env');

function requirePortalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Lawrence Hill Open House Register"');
    return res.status(401).send('Authentication required to access the Open House register.');
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const separatorIdx = credentials.indexOf(':');
    if (separatorIdx === -1) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Lawrence Hill Open House Register"');
      return res.status(401).send('Invalid credentials format.');
    }

    const username = credentials.substring(0, separatorIdx);
    const password = credentials.substring(separatorIdx + 1);

    const userBuf = Buffer.from(username);
    const expectedUserBuf = Buffer.from(OPENHOUSE_ADMIN_USER);
    const passBuf = Buffer.from(password);
    const expectedPassBuf = Buffer.from(OPENHOUSE_ADMIN_PASS);

    const isUserValid = userBuf.length === expectedUserBuf.length && crypto.timingSafeEqual(userBuf, expectedUserBuf);
    const isPassValid = passBuf.length === expectedPassBuf.length && crypto.timingSafeEqual(passBuf, expectedPassBuf);

    if (!isUserValid || !isPassValid) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Lawrence Hill Open House Register"');
      return res.status(401).send('Access denied. Invalid username or password.');
    }

    next();
  } catch (err) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Lawrence Hill Open House Register"');
    return res.status(401).send('Authentication error.');
  }
}

// 1. Private Portal View
app.get('/openhouse-portal', requirePortalAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'openhouse-portal.html'));
});
app.get('/openhouse-portal.html', requirePortalAuth, (req, res) => {
  res.redirect('/openhouse-portal');
});

// 2. Private Attendees API
app.get('/api/openhouse/attendees', requirePortalAuth, (req, res) => {
  try {
    let leads = [];
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    }

    const attendees = leads
      .filter(l => l.isOpenHouse === true || l.source === 'Open House QR Check-In' || l.status === 'OPEN_HOUSE_SIGNIN')
      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    res.json({
      success: true,
      count: attendees.length,
      attendees,
      sources: LEAD_SOURCES
    });
  } catch (err) {
    console.error('Error reading open house attendees:', err);
    res.status(500).json({ error: 'Failed to retrieve attendees.' });
  }
});

// Editable "Source" per attendee (stored as leadSource; `source` is left alone because
// the attendee filter and Follow Up Boss attribution depend on it).
const LEAD_SOURCES = ['Instagram', 'Facebook', 'Google', 'Realtor Referral', 'Friend / Word of Mouth',
  'Signage / Walk-by', 'Flyer / Mailer', 'Open House QR Poster', 'Other'];

app.patch('/api/openhouse/attendees/:id/source', requirePortalAuth, (req, res) => {
  const value = typeof req.body.leadSource === 'string' ? req.body.leadSource : '';
  if (value !== '' && !LEAD_SOURCES.includes(value)) {
    return res.status(400).json({ error: 'Invalid source.' });
  }
  try {
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    const lead = leads.find(l => l.id === req.params.id);
    if (!lead) return res.status(404).json({ error: 'Attendee not found.' });
    lead.leadSource = value;
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
    const payload = `data: ${JSON.stringify({ type: 'source_updated', id: lead.id, leadSource: value })}\n\n`;
    for (const client of sseClients) {
      try { client.write(payload); } catch (e) { sseClients.delete(client); }
    }
    res.json({ success: true, id: lead.id, leadSource: value });
  } catch (err) {
    console.error('Error updating lead source:', err);
    res.status(500).json({ error: 'Failed to update source.' });
  }
});

// 3. Private CSV Export
// 4. Real-Time Push Stream (Server-Sent Events — Zero Polling Traffic)
// Staff confirm who was physically at the open house (checkbox in the portal). Also set automatically
// when someone checks in by QR on the event days. Unchecking removes it.
app.patch('/api/openhouse/attendees/:id/present', requirePortalAuth, (req, res) => {
  if (typeof req.body.present !== 'boolean') return res.status(400).json({ error: 'present must be true or false.' });
  try {
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    const lead = leads.find((l) => l.id === req.params.id);
    if (!lead) return res.status(404).json({ error: 'Attendee not found.' });
    if (req.body.present) lead.presentAt = lead.presentAt || new Date().toISOString();
    else delete lead.presentAt;
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
    broadcastLeadUpdate(lead);
    res.json({ success: true, id: lead.id, presentAt: lead.presentAt || null });
  } catch (err) {
    console.error('Error updating presence:', err);
    res.status(500).json({ error: 'Failed to update.' });
  }
});

app.get('/api/openhouse/stream', requirePortalAuth, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*'
  });

  // Read current attendees for immediate hydration
  let leads = [];
  try {
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    }
  } catch (e) {
    leads = [];
  }

  const attendees = leads
    .filter(l => l.isOpenHouse === true || l.source === 'Open House QR Check-In' || l.status === 'OPEN_HOUSE_SIGNIN')
    .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

  res.write(`data: ${JSON.stringify({ type: 'init', attendees, sources: LEAD_SOURCES })}\n\n`);
  sseClients.add(res);

  // Keep-alive heartbeat every 25 seconds
  const pingInterval = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch (e) {
      clearInterval(pingInterval);
      sseClients.delete(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(pingInterval);
    sseClients.delete(res);
  });
});

app.get('/api/openhouse/export-csv', requirePortalAuth, (req, res) => {
  try {
    let leads = [];
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    }

    const attendees = leads
      .filter(l => l.isOpenHouse === true || l.source === 'Open House QR Check-In' || l.status === 'OPEN_HOUSE_SIGNIN')
      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    const headers = ['Date', 'Time (UTC)', 'Full Name', 'Email', 'Phone', 'Realtor Representation', 'Purchasing Timeline', 'Budget Range', 'Suite Interest', 'Lead Source', 'Raffle Entry #', 'Raffle Status', 'Present', 'Newsletter Opt-in', 'Lead ID', 'Status'];
    const csvRows = [headers.map(c => `"${c}"`).join(',')];

    for (const a of attendees) {
      const dt = new Date(a.timestamp || 0);
      const row = [
        dt.toISOString().split('T')[0],
        dt.toISOString().split('T')[1]?.replace('Z', '') || '',
        a.fullName || '',
        a.email || '',
        a.phone || '',
        a.realtorStatus || 'Direct Buyer',
        a.timeline || 'Immediate',
        a.budgetRange || '',
        a.suiteInterest || 'Model Suite 62',
        a.leadSource || '',
        a.raffleEntryId || '',
        a.raffleEntryId ? (a.presentAt ? 'Attended' : 'Pre-registered') : '',
        a.presentAt ? 'Yes' : '',
        a.subscribeNewsletter ? 'YES' : 'NO',
        a.id || '',
        a.status || 'OPEN_HOUSE_SIGNIN'
      ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');

      csvRows.push(row);
    }

    const today = new Date().toISOString().split('T')[0];
    const filename = `lawrence-hill-openhouse-attendees-${today}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvRows.join('\r\n'));
  } catch (err) {
    console.error('Error generating CSV export:', err);
    res.status(500).send('Error generating CSV export.');
  }
});

// Fallback to index.html for SPA-style routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🏛️ Lawrence Hill Urban Towns web server running at http://localhost:${PORT}`);
});
