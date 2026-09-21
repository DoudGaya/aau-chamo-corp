export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  benefits: string[];
  process: { title: string; detail: string }[];
  faqs: { question: string; answer: string }[];
};

export const services: Service[] = [
  {
    slug: "flight-reservation-ticketing",
    title: "Flight Reservation & Ticketing",
    shortTitle: "Flight reservation",
    summary: "Practical booking guidance for domestic and international journeys.",
    description: "We help travellers prepare and submit flight booking requests with clear passenger, route and date information. Availability, fares and ticket issuance remain subject to airline or authorised staff confirmation.",
    benefits: ["Domestic and international requests", "Itinerary guidance", "Passenger requirement review", "Human follow-up", "WhatsApp handover", "Transparent request status"],
    process: [
      { title: "Tell us the route", detail: "Share departure, destination and preferred travel date." },
      { title: "Add travellers", detail: "Provide passenger count and any travel requirements." },
      { title: "We review", detail: "A travel officer checks the request and available options." },
      { title: "Confirm securely", detail: "A booking is confirmed only after authorised verification." },
    ],
    faqs: [
      { question: "Does an enquiry reserve a seat?", answer: "No. An enquiry starts the review process. A reservation is only confirmed after an authorised staff member or connected airline system confirms it." },
      { question: "Can you support group travel?", answer: "Yes. Include the number of travellers and relevant requirements in the flight enquiry form." },
    ],
  },
  {
    slug: "air-cargo-logistics",
    title: "Air Cargo & Logistics",
    shortTitle: "Air cargo & logistics",
    summary: "Structured cargo movement across airport, door and nationwide routes.",
    description: "From airport-to-airport consignments to door delivery, our cargo team coordinates enquiry intake, handling requirements and operational follow-up across supported routes.",
    benefits: ["Airport-to-airport", "Door-to-airport", "Airport-to-door", "Cargo consolidation", "Interstate air logistics", "Tracking-ready workflow"],
    process: [
      { title: "Describe the shipment", detail: "Provide cargo type, weight, pieces and handling needs." },
      { title: "Set the route", detail: "Choose origin, destination and delivery option." },
      { title: "Operations review", detail: "The cargo team confirms route feasibility and requirements." },
      { title: "Receive next steps", detail: "Staff responds using the reference attached to your enquiry." },
    ],
    faqs: [
      { question: "Can you provide an instant cargo price?", answer: "No unverified price is shown. Submit cargo details and the operations team will prepare a quotation after review." },
      { question: "Can I track my cargo online?", answer: "The tracking interface is integration-ready. Live results depend on the connected inventory system and the tracking number supplied by staff." },
    ],
  },
  {
    slug: "courier-delivery",
    title: "Courier & Delivery",
    shortTitle: "Courier & delivery",
    summary: "Pickup and delivery requests with clear package and route details.",
    description: "Submit local, nationwide or route-specific courier requests with the information our team needs to assess pickup, handling and delivery arrangements.",
    benefits: ["Pickup requests", "Local delivery", "Nationwide delivery", "Package detail capture", "Reference-based follow-up", "Human support"],
    process: [
      { title: "Add pickup", detail: "Tell us where the package will be collected." },
      { title: "Add destination", detail: "Provide the delivery location and preferred date." },
      { title: "Describe the package", detail: "Share size, contents and special handling details." },
      { title: "Get confirmation", detail: "Our team responds after route and service review." },
    ],
    faqs: [
      { question: "Are delivery times guaranteed online?", answer: "No. Delivery timing is provided only after staff reviews the route, package and operational conditions." },
      { question: "Can fragile items be submitted?", answer: "Yes. Describe the item and handling requirement clearly so the team can assess it." },
    ],
  },
  {
    slug: "clearing-forwarding",
    title: "Clearing & Forwarding",
    shortTitle: "Clearing & forwarding",
    summary: "Coordinated documentation and movement support for eligible shipments.",
    description: "We guide customers through clearing and forwarding enquiries, required documentation and coordinated next steps for eligible cargo movements.",
    benefits: ["Document guidance", "Shipment coordination", "Operational review", "Clear handover points", "Reference tracking", "Business support"],
    process: [
      { title: "Share shipment details", detail: "Provide route, commodity and current shipment stage." },
      { title: "Document review", detail: "The team identifies information needed for assessment." },
      { title: "Operational planning", detail: "Eligible requests are routed to the appropriate team." },
      { title: "Staff follow-up", detail: "You receive verified next steps using your reference." },
    ],
    faqs: [
      { question: "Can the website approve customs clearance?", answer: "No. The website collects a request; clearance decisions and requirements are confirmed by authorised personnel and relevant authorities." },
      { question: "What documents are required?", answer: "Requirements vary by cargo and route. Submit an enquiry so the team can advise for your specific case." },
    ],
  },
  {
    slug: "visa-assistance",
    title: "Visa Assistance",
    shortTitle: "Visa assistance",
    summary: "Process guidance for travel-document preparation and application support.",
    description: "Our travel team collects your destination, nationality, travel purpose and preferred date to guide an appropriate visa-assistance enquiry.",
    benefits: ["Requirement guidance", "Application preparation", "Purpose-based routing", "Travel-date review", "Document checklist support", "Human assistance"],
    process: [
      { title: "Select destination", detail: "Tell us the country and purpose of travel." },
      { title: "Add traveller details", detail: "Provide nationality, target date and contact details." },
      { title: "Requirement review", detail: "The team reviews the request against available guidance." },
      { title: "Receive next steps", detail: "Staff shares verified requirements and support options." },
    ],
    faqs: [
      { question: "Does A.A.U Chamo guarantee visa approval?", answer: "No. Visa decisions are made by the relevant authority. We provide preparation and process assistance only." },
      { question: "Can I ask about multiple destinations?", answer: "Yes. List each destination and your travel plan in the enquiry." },
    ],
  },
  {
    slug: "travel-insurance",
    title: "Travel Insurance",
    shortTitle: "Travel insurance",
    summary: "Guidance on suitable travel cover through approved providers.",
    description: "We collect journey and traveller information, then help route requests for suitable travel-insurance options through approved channels.",
    benefits: ["Journey-based enquiry", "Traveller detail review", "Approved-provider routing", "Clear coverage questions", "Travel support", "Reference-based updates"],
    process: [
      { title: "Share the journey", detail: "Add destination, travel dates and traveller count." },
      { title: "Describe cover needs", detail: "Tell us about the type of trip and any concerns." },
      { title: "Provider review", detail: "Available options are checked through approved providers." },
      { title: "Choose after review", detail: "Staff explains verified terms before any decision." },
    ],
    faqs: [
      { question: "Are policy terms shown instantly?", answer: "Only verified terms from an approved provider are presented. Submit a request for a current option." },
      { question: "Is insurance included with a flight enquiry?", answer: "Not automatically. Select travel insurance as a separate service requirement." },
    ],
  },
  {
    slug: "baggage-handling",
    title: "Baggage Handling",
    shortTitle: "Baggage handling",
    summary: "Support for baggage movement, handling questions and special requirements.",
    description: "We route baggage-related service requests with clear item, route and timing details so the appropriate team can assess the requirement.",
    benefits: ["Item detail capture", "Route coordination", "Special handling notes", "Travel-linked support", "Staff escalation", "Clear request status"],
    process: [
      { title: "Describe the baggage", detail: "Share quantity, size and special handling needs." },
      { title: "Add route details", detail: "Provide the relevant airport or travel route." },
      { title: "Handling review", detail: "The appropriate team checks the operational requirement." },
      { title: "Receive guidance", detail: "Verified options are shared by staff." },
    ],
    faqs: [
      { question: "Can oversized baggage be handled?", answer: "It may be possible depending on the route and item. Submit dimensions and weight for assessment." },
      { question: "Is baggage handling a confirmed booking?", answer: "Not until staff confirms availability and the specific arrangement." },
    ],
  },
  {
    slug: "umrah-ziyarah",
    title: "Umrah & Ziyarah",
    shortTitle: "Umrah & Ziyarah",
    summary: "Guided pilgrimage travel enquiries for individuals, families and groups.",
    description: "Submit an Umrah or Ziyarah interest request with traveller count, preferred date and package needs. Our team will follow up with verified package information.",
    benefits: ["Individual and group enquiries", "Preferred-date capture", "Package-interest guidance", "Travel support", "Document assistance", "Human follow-up"],
    process: [
      { title: "Tell us who is travelling", detail: "Provide traveller count and primary contact details." },
      { title: "Choose your period", detail: "Add a preferred date or travel window." },
      { title: "Share package interest", detail: "Tell us the support and arrangements you need." },
      { title: "Staff consultation", detail: "A pilgrimage travel officer follows up with verified options." },
    ],
    faqs: [
      { question: "Are package prices shown online?", answer: "No unverified package price is displayed. Current package details are shared after staff confirmation." },
      { question: "Can families enquire together?", answer: "Yes. Include the total number of travellers and any family requirements." },
    ],
  },
  {
    slug: "international-business-trade",
    title: "International Business & Trade Services",
    shortTitle: "International trade",
    summary: "Structured support for cross-border business and trade enquiries.",
    description: "We help businesses submit clear requests relating to sourcing, movement, coordination and international commercial activity for specialist review.",
    benefits: ["Business enquiry intake", "Trade coordination", "Cross-border support", "Specialist routing", "Document requirement review", "Scalable logistics linkage"],
    process: [
      { title: "Define the objective", detail: "Describe the transaction, market and support required." },
      { title: "Add commercial details", detail: "Share product, route, timing and counterpart information." },
      { title: "Specialist review", detail: "The request is routed to the appropriate business team." },
      { title: "Plan next steps", detail: "Staff responds with verified guidance and requirements." },
    ],
    faqs: [
      { question: "Can you confirm a trade transaction online?", answer: "No. The website captures the request. Commercial arrangements require authorised review and confirmation." },
      { question: "Can trade and cargo requests be combined?", answer: "Yes. Describe both needs and the team will route the request appropriately." },
    ],
  },
];

export const cargoModes = [
  "Airport-to-airport cargo",
  "Door-to-airport delivery",
  "Airport-to-door delivery",
  "Local and nationwide delivery",
  "Interstate air logistics",
  "Cargo consolidation and handling",
];

export const newsItems = [
  { category: "Operations", date: "Network update", title: "A clearer digital gateway for cargo and travel requests", excerpt: "Customers can now submit structured requests and keep one reference from first contact to staff follow-up." },
  { category: "Cargo", date: "Service guide", title: "What to prepare before requesting a cargo quotation", excerpt: "Cargo type, weight, route and delivery preference help our operations team review your request faster." },
  { category: "Travel", date: "Customer information", title: "Booking request versus confirmed reservation", excerpt: "A request begins the process; a booking is confirmed only after authorised verification." },
];

export const branches = [
  { city: "Kano", role: "Head office and operations coordination" },
  { city: "Abuja", role: "Travel, cargo and customer support coverage" },
  { city: "Lagos", role: "Aviation and logistics network coverage" },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
