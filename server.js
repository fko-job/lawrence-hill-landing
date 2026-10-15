import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
app.use(express.static(path.join(__dirname, 'public')));

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

// Zero-Loss Lead Persistence Endpoint
app.post('/api/leads', (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      suiteInterest,
      timeline,
      buyerType,
      preferredTourDate,
      requestPDI,
      requestIncentives,
      notes
    } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: 'Missing required contact details (Name, Email, Phone).' });
    }

    const leadRecord = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      suiteInterest: suiteInterest || '2 Bed (Starting Mid $500Ks)',
      timeline: timeline || '30–90 Days',
      buyerType: buyerType || 'End-User / First-Time Buyer',
      preferredTourDate: preferredTourDate || 'Flexible / Weekend',
      requestPDI: Boolean(requestPDI),
      requestIncentives: Boolean(requestIncentives),
      notes: (notes || '').trim(),
      depositStructure: '5% on Signing',
      closingWindow: '30 to 90 Days',
      modelSuiteLocation: '73 Curlew Dr, Units 62 & 63',
      status: 'NEW_VIP_INQUIRY'
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

    console.log(`[Lead Captured] Lead ID: ${leadRecord.id} | ${leadRecord.fullName} | ${leadRecord.email}`);

    return res.status(201).json({
      success: true,
      leadId: leadRecord.id,
      message: 'Your VIP allocation request and private tour inquiry has been securely registered.',
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

// Fallback to index.html for SPA-style routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🏛️ Lawrence Hill Urban Towns web server running at http://localhost:${PORT}`);
});
