/**
 * Centralized Static Data Registry
 * Exports all static data arrays used across application screens.
 */

import colors from './color';
import { images } from '../assets';


// Driver Registration 5-Step Flow Data
export const DRIVER_REGISTRATION_STEPS = [
  {
    step: 1,
    title: 'Personal details',
    percent: '20% complete',
    subtitle: 'We check these against your licence, so use the exact spelling.',
    btnLabel: 'Continue to licence',
  },
  {
    step: 2,
    title: 'Driving licence',
    percent: '40% complete',
    subtitle: 'Both sides, all four corners in frame and the text readable.',
    btnLabel: 'Continue to vehicle',
  },
  {
    step: 3,
    title: 'Vehicle details',
    percent: '60% complete',
    subtitle: 'Register the vehicle you will actually drive. You can add more later',
    btnLabel: 'Continue to insurance',
  },
  {
    step: 4,
    title: 'Insurance',
    percent: '80% complete',
    subtitle: 'A valid policy for this vehicle. We read the expiry date from the document',
    btnLabel: 'Continue to payout',
  },
  {
    step: 5,
    title: 'Bank & payout',
    percent: '100% complete',
    subtitle: 'Where your daily earnings land. The account must be in your own name',
    btnLabel: 'Review and submit',
  },
];

export const DRIVER_REGISTRATION_CHECKLIST = [
  { id: '1', text: 'Licence number matches the card', status: 'valid' },
  { id: '2', text: 'Name matches your personal details', status: 'valid' },
  { id: '3', text: 'Licence is valid for at least 30 more days', status: 'warning' },
  { id: '4', text: 'Category covers the vehicle you register', status: 'info' },
];

export const DRIVER_REGISTRATION_VEHICLE_TYPES = [
  { id: 'bike', name: 'Bike', meta: '2 seats · solo rider', icon: 'motorbike' },
  { id: 'auto', name: 'Auto', meta: '3 seats · metered', icon: 'rickshaw' },
  { id: 'mini', name: 'Cab Mini', meta: '4 seats · hatchback', icon: 'car-hatchback' },
  { id: 'sedan', name: 'Cab Sedan', meta: '4 seats · AC sedan', icon: 'car-side' },
];

export const DRIVER_REVIEW_ITEMS = [
  {
    id: 'personal',
    step: 1,
    title: 'Personal',
    meta: 'Name, DOB, photo, mobile',
    count: '4 of 4',
    icon: 'user',
  },
  {
    id: 'licence',
    step: 2,
    title: 'Driving licence',
    meta: 'Number, front and back',
    count: '3 of 3',
    icon: 'credit-card',
  },
  {
    id: 'vehicle',
    step: 3,
    title: 'Vehicle',
    meta: 'Cab Sedan · GJ 01 MJ 4821',
    count: '4 of 4',
    icon: 'car',
  },
  {
    id: 'insurance',
    step: 4,
    title: 'Insurance',
    meta: 'Policy, document, expiry',
    count: '3 of 3',
    icon: 'shield',
  },
  {
    id: 'payout',
    step: 5,
    title: 'Bank & payout',
    meta: 'HDFC Bank ···4417',
    count: '3 of 3',
    icon: 'wallet',
  },
];

export const DRIVER_VERIFICATION_TIMELINE = [
  { id: 'sub', title: 'Application submitted', time: '19 Sep, 2:14 pm', status: 'done' },
  { id: 'doc', title: 'Document authenticity', time: '~2 hours left', status: 'active' },
  { id: 'veh', title: 'Vehicle and RC match', time: 'Queued', status: 'pending' },
  { id: 'final', title: 'Final approval', time: 'Queued', status: 'pending' },
];

export const DRIVER_VERIFICATION_CHECKING = [
  { id: '1', title: 'Personal details', status: 'verified', pill: 'Verified' },
  { id: '2', title: 'Driving licence', status: 'verified', pill: 'Verified' },
  { id: '3', title: 'Vehicle & RC', status: 'checking', pill: 'Checking' },
  { id: '4', title: 'Insurance', status: 'verified', pill: 'Verified' },
  { id: '5', title: 'Bank & payout', status: 'transfer', pill: '₹1 test transfer sent' },
];

export const DRIVER_REJECTION_ITEMS = [
  {
    id: 'dl_back',
    title: 'DL back',
    reason: 'Out of focus — the licence number on the reverse is unreadable.',
    btnLabel: 'Retake',
  },
  {
    id: 'rc_doc',
    title: 'RC document',
    reason: 'Name on the RC does not match your personal details.',
    btnLabel: 'Re-upload',
  },
];

// Driver Daily Safety Check
export const DRIVER_SAFETY_VEHICLE_ITEMS = [
  { id: 'tyres', title: 'Tyres have visible tread and correct pressure' },
  { id: 'brakes', title: 'Brakes and handbrake work smoothly' },
  { id: 'lights', title: 'Headlights, indicators, and brake lights work' },
  { id: 'belts', title: 'Seatbelts intact for all seats' },
];

export const DRIVER_SAFETY_IN_CAR_ITEMS = [
  { id: 'firstaid', title: 'First-aid kit present and sealed' },
  { id: 'extinguisher', title: 'Fire extinguisher in date' },
  { id: 'clean', title: 'Vehicle clean and sanitized' },
];

// Driver Earnings
export const DRIVER_EARNINGS_PERIOD_TABS = ['Today', 'Week', 'Month', 'Custom'];

export const DRIVER_EARNINGS_CHART_DATA = [
  { day: 'Mon', height: 38, active: false, amount: '₹1,240' },
  { day: 'Tue', height: 30, active: false, amount: '₹980' },
  { day: 'Wed', height: 48, active: false, amount: '₹1,560' },
  { day: 'Thu', height: 58, active: false, amount: '₹1,890' },
  { day: 'Fri', height: 82, active: true, amount: '₹2,410' },
  { day: 'Sat', height: 70, active: false, amount: '₹2,150' },
  { day: 'Sun', height: 42, active: false, amount: '₹1,610' },
];

export const DRIVER_EARNINGS_RIDE_HISTORY = [
  {
    id: '1',
    time: '12:24 pm',
    route: 'Brigade Rd → Airport T2 · 14.2 km',
    earning: '₹198.03',
    fare: 'fare breakdown',
  },
  {
    id: '2',
    time: '10:58 am',
    route: 'Indiranagar → Whitefield · 16.8 km',
    earning: '₹219.76',
    fare: 'fare breakdown',
  },
  {
    id: '3',
    time: '08:30 am',
    route: 'HSR Layout → Electronic City · 12.1 km',
    earning: '₹165.20',
    fare: 'fare breakdown',
  },
];

// Driver Incentive Tracker
export const DRIVER_COMPLETED_INCENTIVES = [
  {
    id: '1',
    title: 'Daily 8-ride target',
    date: 'Yesterday',
    amount: '₹200',
    status: 'paid',
    statusLabel: 'PAID TO WALLET',
  },
  {
    id: '2',
    title: 'Peak hour streak (3 rides)',
    date: '12 Sep',
    amount: '₹150',
    status: 'paid',
    statusLabel: 'PAID TO WALLET',
  },
  {
    id: '3',
    title: 'Weekend bonus 25 rides',
    date: '8 Sep',
    amount: '₹800',
    status: 'paid',
    statusLabel: 'PAID TO WALLET',
  },
];

// Driver Incentives
export const DRIVER_REFERRALS = [
  {
    id: '1',
    initials: 'SP',
    name: 'Suresh P.',
    sub: '28 trips done · reward paid',
    amount: '+ ₹1,000',
    status: 'Paid',
    color: '#FF6600',
  },
  {
    id: '2',
    initials: 'MK',
    name: 'Manoj K.',
    sub: '14 of 25 trips done',
    amount: 'In progress',
    status: 'Pending',
    color: '#0D2B47',
  },
  {
    id: '3',
    initials: 'AV',
    name: 'Amit V.',
    sub: 'Invited 2 days ago',
    amount: 'Pending signup',
    status: 'Invited',
    color: '#6F809E',
  },
];

// Driver Subscription
export const DRIVER_PRO_BENEFITS = [
  'Unlimited rides every week',
  '12% commission after 40 rides',
  'Priority ride matching',
  'Daily payouts before 6 pm',
  'Priority support within 4 hours',
];

// Driver Trip History
export const DRIVER_TRIP_PERIODS = ['Today', 'Week', 'Month', 'Custom'];
export const DRIVER_TRIP_STATUS_FILTERS = ['Completed', 'Cancelled', 'All'];

export const DRIVER_TRIPS_DATA = [
  {
    id: '1',
    time: 'Today · 12:24 pm',
    status: 'completed',
    statusLabel: 'Completed',
    pickup: 'Prestige Tech Park, Gate 3',
    drop: 'Kempegowda Intl. Airport, T2',
    meta: 'Cab Sedan · 14.2 km · 38 min',
    amount: '₹198.03',
  },
  {
    id: '2',
    time: 'Today · 10:58 am',
    status: 'completed',
    statusLabel: 'Completed',
    pickup: 'Indiranagar 100 Feet Road',
    drop: 'Whitefield, ITPL Main Rd',
    meta: 'Cab Sedan · 16.8 km · 42 min',
    amount: '₹219.76',
  },
  {
    id: '3',
    time: 'Yesterday · 08:30 am',
    status: 'completed',
    statusLabel: 'Completed',
    pickup: 'HSR Layout Sector 2',
    drop: 'Electronic City Phase 1',
    meta: 'Cab Sedan · 12.1 km · 26 min',
    amount: '₹165.20',
  },
  {
    id: '4',
    time: 'Yesterday · 07:15 am',
    status: 'cancelled',
    statusLabel: 'Cancelled',
    pickup: 'Koramangala 5th Block',
    drop: 'MG Road Metro Station',
    meta: 'Cab Sedan · Rider cancelled',
    amount: '₹25.00',
  },
];

// Driver Wallet
export const DRIVER_WALLET_QUICK_AMOUNTS = [
  { id: '1000', label: '₹1,000', value: '1,000' },
  { id: '2500', label: '₹2,500', value: '2,500' },
  { id: '4200', label: '₹4,200', value: '4,200' },
  { id: 'full', label: 'Withdraw all', value: '6,420' },
];

export const DRIVER_WALLET_PAYOUT_HISTORY = [
  {
    id: '1',
    title: 'Withdrawal · 8 Sep, 6:40 pm',
    sub: 'Credited to HDFC •••• 6621',
    amount: '₹4,200.00',
    status: 'paid',
    statusLabel: 'Paid',
  },
  {
    id: '2',
    title: 'Withdrawal · 9 Sep, 11:02 am',
    sub: 'Usually lands within 24 hours',
    amount: '₹1,800.00',
    status: 'processing',
    statusLabel: 'Processing',
  },
  {
    id: '3',
    title: 'Weekly Payout · 1 Sep, 6:00 pm',
    sub: 'Auto payout credited to HDFC •••• 6621',
    amount: '₹12,450.00',
    status: 'paid',
    statusLabel: 'Paid',
  },
  {
    id: '4',
    title: 'Withdrawal · 28 Aug, 4:15 pm',
    sub: 'Failed · returned to wallet',
    amount: '₹3,000.00',
    status: 'refunded',
    statusLabel: 'Refunded',
  },
];

// Preferred Destination
export const DRIVER_MATCHING_RULES = [
  {
    id: 'radius',
    ok: true,
    text: 'Rides must end within 3 km of your destination',
  },
  {
    id: 'duration',
    ok: true,
    text: 'Active for 90 minutes or until you accept',
  },
  {
    id: 'airport',
    ok: false,
    text: 'Airport and outstation rides are excluded',
  },
  {
    id: 'surge',
    ok: true,
    text: 'Surge still applies on matched rides',
  },
];

// Cancel Ride Reasons
export const DRIVER_CANCEL_REASONS = [
  'Passenger is not at the pickup point',
  'Passenger asked me to cancel',
  'Pickup is too far or unreachable',
  'Vehicle problem or breakdown',
  'Wrong drop location or route',
];

// Upload Documents
export const DRIVER_DOCUMENTS_LIST = [
  {
    id: 'dl',
    title: 'Driving licence',
    sub: 'Approved 08 Sep',
    status: 'approved',
    statusLabel: 'Approved',
    icon: 'file-text',
    action: 'view',
  },
  {
    id: 'rc',
    title: 'Registration certificate',
    sub: 'Approved 08 Sep',
    status: 'approved',
    statusLabel: 'Approved',
    icon: 'file-text',
    action: 'view',
  },
  {
    id: 'photo',
    title: 'Profile photo',
    sub: 'Approved 09 Sep',
    status: 'approved',
    statusLabel: 'Approved',
    icon: 'camera',
    action: 'view',
  },
  {
    id: 'insurance',
    title: 'Insurance policy',
    sub: 'Blurred — page 2 unreadable',
    status: 'rejected',
    statusLabel: 'Rejected',
    btnLabel: 'Re-upload',
    icon: 'shield',
    captureTitle: 'Photograph insurance policy',
    captureHint: 'Ensure page 2 details and expiry date are clear.',
    fileName: 'insurance_policy.jpg',
  },
  {
    id: 'bank',
    title: 'Bank passbook',
    sub: 'Not uploaded yet',
    status: 'pending',
    statusLabel: 'Pending',
    btnLabel: 'Upload',
    icon: 'credit-card',
    captureTitle: 'Photograph the first page',
    captureHint: 'Account holder name, account number and IFSC must all be readable.',
    fileName: 'passbook_front.jpg',
  },
];

// Map Backdrop Demand Zones
export const DRIVER_DEMAND_ZONES = [
  { top: 120, left: 210, size: 200, opacity: 1 },
  { top: 250, left: 66, size: 180, opacity: 0.85 },
  { top: 300, left: 250, size: 160, opacity: 0.75 },
];

// Sidebar Links
export const PASSENGER_SIDEBAR_LINKS = [
  { label: 'Home', screen: 'Home', iconKind: 'home' },
  { label: 'Services', screen: 'Services', iconKind: 'grid' },
  { label: 'Activity', screen: 'Activity', iconKind: 'clock' },
  { label: 'Wallet', screen: 'Wallet', iconKind: 'wallet' },
  { label: 'Notifications', screen: 'Notifications', iconKind: 'bell' },
  { label: 'Settings', screen: 'Setting', iconKind: 'settings' },
  { label: 'Help', screen: 'Help', iconKind: 'help' },
];

export const DRIVER_SIDEBAR_LINKS = [
  { label: 'Dashboard', screen: 'Dashboard', iconKind: 'home' },
  { label: 'Documents & KYC', screen: 'UploadDocuments', iconKind: 'fileText' },
  { label: 'Trip History', screen: 'DriverTripHistory', iconKind: 'history' },
  { label: 'Earnings', screen: 'Earnings', iconKind: 'rupee' },
  { label: 'Wallet', screen: 'Wallet', iconKind: 'wallet' },
  { label: 'Incentives', screen: 'Incentives', iconKind: 'gift' },
  { label: 'Subscription', screen: 'DriverSubscription', iconKind: 'award' },
  { label: 'Profile', screen: 'Profile', iconKind: 'user' },
  { label: 'Daily Safety Check', screen: 'DriverDailySafetyCheck', iconKind: 'shield' },
  { label: 'Airport Queue', screen: 'DriverAirportQueue', iconKind: 'plane' },
];

// Home Tab Bar Items
export const HOME_TAB_BAR_ITEMS = [
  { name: 'Home', label: 'Home', kind: 'home' },
  { name: 'Dashboard', label: 'Dashboard', kind: 'home' },
  { name: 'Services', label: 'Services', kind: 'grid' },
  { name: 'Activity', label: 'Activity', kind: 'clock' },
  { name: 'Earnings', label: 'Earnings', kind: 'rupee' },
  { name: 'Wallet', label: 'Wallet', kind: 'wallet' },
  { name: 'Incentives', label: 'Incentives', kind: 'gift' },
  { name: 'Profile', label: 'Profile', kind: 'user' },
];

// New Ride Request Route Waypoints
export const DRIVER_ROUTE_WAYPOINTS = [
  { x: 0.14, y: 0.68 },
  { x: 0.18, y: 0.58 },
  { x: 0.26, y: 0.52 },
  { x: 0.36, y: 0.48 },
  { x: 0.46, y: 0.42 },
  { x: 0.52, y: 0.36 },
  { x: 0.6, y: 0.28 },
  { x: 0.68, y: 0.2 },
  { x: 0.76, y: 0.14 },
  { x: 0.84, y: 0.08 },
];

// Services Screen
export const SERVICES_RIDE_NOW = [
  {
    id: 'cab',
    label: 'Cab',
    meta: '4 seats · from ₹68',
    icon: 'car-side',
    badge: 'Most booked',
  },
  {
    id: 'auto',
    label: 'Auto',
    meta: '3 seats · door pickup',
    icon: 'subway',
    badge: 'Save 15%',
  },
  {
    id: 'bike',
    label: 'Moto',
    meta: '1 seat · fastest in traffic',
    icon: 'motorbike',
    badge: 'Fastest',
  },
  {
    id: 'outstation',
    label: 'Outstation',
    meta: 'Intercity · one-way / round',
    icon: 'map-marker-distance',
    badge: 'Intercity',
  },
];

export const SERVICES_PLAN_AHEAD = [
  {
    id: 'schedule',
    kicker: 'Book up to 7 days ahead',
    title: 'Schedule a ride',
    icon: 'calendar',
  },
  {
    id: 'airport',
    kicker: 'Guaranteed pickup',
    title: 'Airport ride',
    icon: 'plane',
  },
  {
    id: 'rentals',
    kicker: '1 to 12 hours',
    title: 'Hourly rentals',
    icon: 'clock',
  },
  {
    id: 'portal',
    kicker: 'Send parcels & documents',
    title: 'Parcel delivery',
    icon: 'package',
  },
];

// Search Screen
export const SEARCH_ITEMS_LIST = [
  {
    id: '1',
    title: 'Gym & Fitness Transformation',
    category: 'Workout & Health',
    icon: '🏋️',
    rating: 4.9,
    tag: 'Trending',
  },
  {
    id: '2',
    title: 'UI/UX Mobile Design System',
    category: 'Design & Code',
    icon: '🎨',
    rating: 4.8,
    tag: 'Popular',
  },
  {
    id: '3',
    title: 'Full Stack React Native App',
    category: 'Development',
    icon: '💻',
    rating: 5.0,
    tag: 'Featured',
  },
];

// Help Screen
export const HELP_TOPICS = [
  { id: 'fares', title: 'Fares & payments', iconType: 'text', icon: '₹' },
  { id: 'safety', title: 'Safety', iconType: 'feather', icon: 'shield' },
  { id: 'account', title: 'Account & profile', iconType: 'feather', icon: 'user' },
  { id: 'cancellation', title: 'Cancellations', iconType: 'feather', icon: 'x-circle' },
];

export const HELP_FAQS = [
  { id: 'cancel', question: 'Why was I charged a cancellation fee?' },
  { id: 'surge', question: 'How do surge prices work?' },
  { id: 'lost', question: 'I left an item in the cab — what do I do?' },
];

// Safety Screen
export const SAFETY_TOOLS = [
  {
    id: 'contacts',
    title: 'Trusted contacts',
    sub: 'Share live trip automatically with 5 people',
    icon: 'users',
    accent: '#FF6600',
  },
  {
    id: 'pin',
    title: '4-digit PIN verification',
    sub: 'Ensure you step into the correct cab every time',
    icon: 'lock',
    accent: '#26A85E',
  },
  {
    id: 'audio',
    title: 'Audio recording',
    sub: 'Record audio during trip for safety disputes',
    icon: 'mic',
    accent: '#2E7BE7',
  },
];


// ==================== PASSENGER FLOW STATIC DATA ====================

export const PASSENGER_ACTIVITY_TABS = [
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'scheduled', label: 'Scheduled' },
];

export const PASSENGER_ACTIVITY_RIDES = [
  {
    id: 'r1',
    status: 'completed',
    when: 'Today · 12:24 pm',
    month: 'SEPTEMBER 2026',
    pickup: '12, Brigade Road, Ashok Nagar',
    drop: 'Kempegowda Intl. Airport, T2',
    vehicle: 'Cab Sedan',
    meta: '14.2 km',
    icon: 'car-side',
    fare: '₹241.50',
  },
  {
    id: 'r2',
    status: 'cancelled',
    when: 'Yesterday · 8:02 pm',
    month: 'SEPTEMBER 2026',
    pickup: 'Prestige Tech Park, Marathahalli',
    drop: 'Indiranagar 100 Feet Road',
    vehicle: 'Auto',
    meta: 'cancelled by you',
    icon: 'rickshaw',
    fare: '₹30',
  },
  {
    id: 'r3',
    status: 'completed',
    when: 'Fri 11 Sep · 6:40 pm',
    month: 'SEPTEMBER 2026',
    pickup: 'Indiranagar 100ft Road',
    drop: 'Koramangala 5th Block',
    vehicle: 'Bike',
    meta: '6.4 km',
    icon: 'motorbike',
    fare: '₹41',
  },
  {
    id: 'r4',
    status: 'scheduled',
    when: 'Sat 20 Sep · 07:00 am',
    month: 'SEPTEMBER 2026',
    pickup: 'Home, Brigade Road',
    drop: 'Kempegowda Intl. Airport, T2',
    vehicle: 'Cab Sedan',
    meta: 'scheduled',
    icon: 'car-side',
    fare: '₹520',
  },
];

export const PASSENGER_SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'fare_high', label: 'Fare · high to low' },
  { id: 'fare_low', label: 'Fare · low to high' },
];

export const PASSENGER_SORT_SERVICES = [
  'Cab',
  'Auto',
  'Bike',
  'Airport',
  'Rental',
  'Outstation',
  'Portal',
  'Scheduled',
];

export const PASSENGER_ADD_MONEY_QUICK = [200, 500, 1000, 2000];
export const PASSENGER_ADD_MONEY_MIN = 100;
export const PASSENGER_ADD_MONEY_MAX = 10000;

export const PASSENGER_ADD_MONEY_METHODS = [
  {
    id: 'upi',
    title: 'UPI',
    subtitle: 'you@okaxis · instant',
    icon: 'upi',
  },
  {
    id: 'card',
    title: 'HDFC Credit Card',
    subtitle: '•••• 4821',
    icon: 'card',
  },
];

export const PASSENGER_AIRPORT_SURCHARGES = [
  { id: 'entry', label: 'Airport entry fee', amount: 150 },
  { id: 'parking', label: 'Parking (reimbursed on receipt)', amount: 110 },
  { id: 'terminal', label: 'Terminal pickup surcharge', amount: 80 },
];

export const PASSENGER_CHOOSE_RIDES = [
  {
    id: 'bike',
    name: 'Bike',
    seats: 1,
    awayMin: 1,
    price: 58,
    eta: '12:08 pm',
    badge: 'Fastest',
    icon: 'motorbike',
  },
  {
    id: 'auto',
    name: 'Auto',
    seats: 3,
    awayMin: 2,
    price: 96,
    eta: '12:14 pm',
    badge: 'Cheapest',
    icon: 'rickshaw',
  },
  {
    id: 'mini',
    name: 'Cab Mini',
    seats: 4,
    awayMin: 4,
    price: 184,
    eta: '12:19 pm',
    icon: 'car-hatchback',
  },
  {
    id: 'sedan',
    name: 'Cab Sedan',
    seats: 4,
    awayMin: 5,
    price: 248,
    eta: '12:24 pm',
    badge: 'Extra room',
    icon: 'car-side',
  },
];

export const PASSENGER_BOOK_FOR_OTHERS_RECEIVES = [
  'Driver name, photo and vehicle number',
  'A live tracking link that needs no login',
  'The 4-digit start OTP by SMS',
];

export const PASSENGER_PAYMENT_OFFERS_METHODS = [
  {
    id: 'upi',
    title: 'UPI',
    subtitle: 'you@okaxis',
    label: 'UPI • you@okaxis',
    icon: 'currency-inr',
  },
  {
    id: 'card',
    title: 'HDFC Credit Card',
    subtitle: '•••• 4821 · Expires 09/28',
    label: 'Card •••• 4821',
    icon: 'credit-card-outline',
  },
  {
    id: 'wallet',
    title: 'Cabora Wallet',
    subtitle: 'Balance ₹1,240.00',
    label: 'Wallet • ₹1,240',
    icon: 'wallet-outline',
  },
  {
    id: 'cash',
    title: 'Cash',
    subtitle: 'Pay the driver directly',
    label: 'Cash',
    icon: 'cash',
  },
];

export const PASSENGER_SCHEDULE_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const PASSENGER_SCHEDULE_MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const PASSENGER_SCHEDULE_TIMES = [
  '05:30 am',
  '06:00 am',
  '06:30 am',
  '07:00 am',
  '07:30 am',
  '08:00 am',
  '08:30 am',
  '09:00 am',
];

export const PASSENGER_SCHEDULE_VEHICLES = [
  {
    id: 'comfort',
    name: 'Comfort',
    price: 1180,
    meta: 'Sedan · 4',
    icon: 'car-side',
  },
  {
    id: 'economy',
    name: 'Economy',
    price: 940,
    meta: 'Hatch · 4',
    icon: 'car-hatchback',
  },
  {
    id: 'xl',
    name: 'XL',
    price: 1640,
    meta: 'SUV · 6',
    icon: 'van-passenger',
  },
];

export const PASSENGER_EMERGENCY_CONTACTS = [
  {
    id: 'c1',
    initials: 'PM',
    name: 'Priya Menon',
    meta: 'Sister · +91 98200 11223',
  },
  {
    id: 'c2',
    initials: 'VM',
    name: 'Vikram Mehta',
    meta: 'Father · +91 99450 88112',
  },
];

export const PASSENGER_EMERGENCY_QUICK = [
  { id: 'police', label: 'Police', sub: '100', icon: 'siren', dial: '100' },
  {
    id: 'ambulance',
    label: 'Ambulance',
    sub: '108',
    icon: 'phone',
    dial: '108',
  },
  {
    id: 'safety',
    label: 'Cabora',
    sub: 'Safety',
    icon: 'headset',
    dial: null,
  },
];

export const PASSENGER_FINDING_NEARBY = [
  { id: 'v1', icon: 'car-side', top: '18%', left: '18%' },
  { id: 'v2', icon: 'rickshaw', top: '28%', right: '16%' },
  { id: 'v3', icon: 'motorbike', bottom: '22%', left: '28%' },
];

export const PASSENGER_FINDING_ALT_RIDES = [
  { id: 'auto', name: 'Auto', price: 96, icon: 'rickshaw' },
  { id: 'bike', name: 'Bike', price: 58, icon: 'motorbike' },
];

export const PASSENGER_RATE_TIP_TAGS = [
  'Safe driving',
  'Clean vehicle',
  'Polite',
  'On time',
  'Great route',
];

export const PASSENGER_RATE_TIP_OPTIONS = [
  { id: 10, label: '₹10' },
  { id: 20, label: '₹20' },
  { id: 50, label: '₹50' },
  { id: 'custom', label: 'Custom' },
];

export const PASSENGER_TRIP_COMPLETED_FARE_ROWS = [
  { id: 'base', label: 'Base fare', value: '₹60.00' },
  { id: 'distance', label: 'Distance · 14.2 km', value: '₹156.20' },
  { id: 'time', label: 'Time · 38 min', value: '₹41.80' },
  { id: 'surge', label: 'Peak-hour surge 1.2x', value: '₹19.60' },
  { id: 'tax', label: 'Taxes & fees (GST 5%)', value: '₹13.90' },
  {
    id: 'promo',
    label: 'Promo CABORA50',
    value: '- ₹50.00',
    promo: true,
  },
];

export const PASSENGER_HOME_EXPLORE = [
  { id: 'auto', label: 'Auto', price: 'from ₹48', icon: 'rickshaw' },
  { id: 'bike', label: 'Bike', price: 'from ₹29', icon: 'motorbike' },
  { id: 'portal', label: 'Portal', price: 'from ₹39', icon: 'briefcase' },
  { id: 'more', label: 'More', price: '9 services', more: true, icon: 'grid' },
];

export const PASSENGER_LOCATION_BENEFITS = [
  {
    id: 'pin',
    icon: 'map-pin',
    text: 'Pickup accurate to the doorway',
  },
  {
    id: 'eta',
    icon: 'clock',
    text: 'ETAs based on where you actually are',
  },
  {
    id: 'privacy',
    icon: 'shield-check',
    text: 'Tracking stops the moment your trip ends',
  },
];

export const PASSENGER_LOCATION_SAVED_PLACES = [
  {
    id: 'home',
    title: 'Home',
    subtitle: '12, Brigade Road, Ashok Nagar',
    icon: 'home',
  },
  {
    id: 'work',
    title: 'Work',
    subtitle: 'Prestige Tech Park, Marathahalli',
    icon: 'briefcase',
  },
  {
    id: 'recent',
    title: 'Ulsoor Lake Gate 2',
    subtitle: 'Used 3 days ago',
    icon: 'clock',
  },
];

export const PASSENGER_NOTIFICATIONS_TODAY = [
  {
    id: '1',
    category: 'rides',
    title: 'Your ride is complete',
    subtitle: 'CBR-88214 · ₹428 paid from wallet',
    time: '18:52',
    unread: true,
    iconType: 'lucide',
    iconName: 'car',
    iconColor: colors.primary,
    iconBg: colors.orange.subtleBg,
  },
  {
    id: '2',
    category: 'safety',
    title: 'Safety check',
    subtitle: "We noticed a long stop. Tap to confirm you're okay.",
    time: '18:41',
    unread: true,
    iconType: 'mdi',
    iconName: 'alarm-light-outline',
    iconColor: colors.danger,
    iconBg: colors.red.badge,
  },
  {
    id: '3',
    category: 'offers',
    title: '₹75 cashback credited',
    subtitle: 'From code RIDE30 on your last trip',
    time: '14:20',
    unread: false,
    iconType: 'mdi',
    iconName: 'gift-outline',
    iconColor: colors.amber[500],
    iconBg: colors.orange.accentBg,
  },
];

export const PASSENGER_NOTIFICATIONS_EARLIER = [
  {
    id: '4',
    category: 'offers',
    title: '40% off with MONSOON40',
    subtitle: 'Valid on Comfort rides until 30 Sep',
    time: 'Yesterday',
    unread: false,
    iconType: 'feather',
    iconName: 'percent',
    iconColor: colors.primary,
    iconBg: colors.orange.subtleBg,
  },
  {
    id: '5',
    category: 'safety',
    title: 'Trusted contact added',
    subtitle: 'Priya Sharma can now see your live trips',
    time: 'Yesterday',
    unread: false,
    iconType: 'mdi',
    iconName: 'shield-check-outline',
    iconColor: colors.green[500],
    iconBg: colors.green.mint,
  },
  {
    id: '6',
    category: 'rides',
    title: 'September invoice ready',
    subtitle: 'Zenith Labs · ₹2,74,924 · due 16 Oct',
    time: '09 Sep',
    unread: false,
    iconType: 'mdi',
    iconName: 'file-document-outline',
    iconColor: colors.blue[500],
    iconBg: colors.blue[50],
  },
  {
    id: '7',
    category: 'rides',
    title: 'Rohit joined your ride',
    subtitle: 'He was added as a co-rider on CBR-87990',
    time: '08 Sep',
    unread: false,
    iconType: 'feather',
    iconName: 'users',
    iconColor: colors.blue[500],
    iconBg: colors.blue[50],
  },
];

export const PASSENGER_NOTIFICATIONS_CATEGORIES = [
  { id: 'all', label: 'All 12' },
  { id: 'rides', label: 'Rides' },
  { id: 'offers', label: 'Offers' },
  { id: 'safety', label: 'Safety' },
];

export const PASSENGER_OUTSTATION_VEHICLES = [
  {
    id: 'comfort',
    name: 'Comfort',
    model: 'Dzire',
    seats: '4 seats',
    icon: 'car-side',
    price: 4860,
  },
  {
    id: 'xl',
    name: 'XL',
    model: 'Ertiga',
    seats: '6',
    icon: 'car-estate',
    price: 6420,
  },
  {
    id: 'premium',
    name: 'Premium',
    model: 'Civic',
    seats: '4',
    icon: 'car-side',
    price: 8940,
  },
];

export const PASSENGER_OUTSTATION_FARE_ROWS = [
  { id: 'km', label: '288 km at ₹13/km', amount: 3744 },
  { id: 'allowance', label: 'Driver allowance (2 days)', amount: 600 },
  { id: 'permit', label: 'State permit & toll', amount: 396 },
  { id: 'gst', label: 'GST (5%)', amount: 120 },
];

export const PASSENGER_PORTAL_DELIVERED_FARE_ROWS = [
  { id: 'base', label: 'Base fare · 6.4 km', amount: 34 },
  { id: 'handling', label: 'Handling', amount: 5 },
  { id: 'gst', label: 'GST (5%)', amount: 2 },
];

export const PASSENGER_PORTAL_SAVED = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'mums', label: "Mum's place" },
  { id: 'new', label: '+ New' },
];

export const PASSENGER_PORTAL_PLACE_SUGGESTIONS = [
  {
    id: 'indira-100',
    title: 'Indiranagar 100ft Road',
    meta: '402, Brigade Residency, Bengaluru 560038',
  },
  {
    id: 'indira-metro',
    title: 'Indiranagar Metro Station',
    meta: '100 Feet Rd, Indiranagar, Bengaluru 560038',
  },
  {
    id: 'indira-12th',
    title: 'Indiranagar 12th Main',
    meta: 'Near CMH Road, Bengaluru 560008',
  },
  {
    id: 'kora-5',
    title: 'Koramangala 5th Block',
    meta: '18, 80 Feet Road, near Sony World, Bengaluru 560095',
  },
  {
    id: 'kora-forum',
    title: 'The Forum Mall Koramangala',
    meta: 'Hosur Road, Koramangala, Bengaluru 560095',
  },
  {
    id: 'hsr',
    title: 'HSR Layout Sector 2',
    meta: '27th Main Rd, HSR Layout, Bengaluru 560102',
  },
  {
    id: 'jayanagar',
    title: 'Jayanagar 4th Block',
    meta: '11th Main Rd, Jayanagar, Bengaluru 560011',
  },
  {
    id: 'mg',
    title: 'MG Road',
    meta: 'Near Trinity Metro, Bengaluru 560001',
  },
  {
    id: 'whitefield',
    title: 'Whitefield Main Road',
    meta: 'ITPL Road, Whitefield, Bengaluru 560066',
  },
  {
    id: 'airport',
    title: 'Kempegowda International Airport',
    meta: 'Terminal 2, Devanahalli, Bengaluru 560300',
  },
];

export const PASSENGER_PORTAL_TYPES = [
  { id: 'documents', label: 'Documents', icon: 'file-text' },
  { id: 'clothes', label: 'Clothes', icon: 'briefcase' },
  { id: 'gift', label: 'Gift', icon: 'gift' },
  { id: 'electronics', label: 'Electronics', icon: 'smartphone' },
  { id: 'medicines', label: 'Medicines', icon: 'pill' },
  { id: 'other', label: 'Other', icon: 'more-vertical' },
];

export const PASSENGER_PORTAL_SIZES = [
  {
    id: 'small',
    title: 'Small',
    weight: 'up to 3 kg',
    hint: 'fits a bike box',
    vehicle: 'Bike is enough',
  },
  {
    id: 'medium',
    title: 'Medium',
    weight: '3–10 kg',
    hint: 'needs an auto',
    vehicle: 'Auto is enough',
  },
  {
    id: 'large',
    title: 'Large',
    weight: '10–25 kg',
    hint: 'needs a cab',
    vehicle: 'Cab is needed',
  },
];

export const PASSENGER_PORTAL_RIDERS = [
  {
    id: 'bike',
    title: 'Portal on Bike',
    meta: 'up to 3 kg · 24 min',
    price: 39,
    total: 41,
    icon: 'motorbike',
    badge: 'Cheapest',
    badgeTone: 'orange',
  },
  {
    id: 'auto',
    title: 'Portal on Auto',
    meta: 'up to 10 kg · 28 min',
    price: 79,
    total: 83,
    icon: 'rickshaw',
  },
  {
    id: 'cab',
    title: 'Portal on Cab',
    meta: 'up to 25 kg · 26 min',
    price: 129,
    total: 136,
    icon: 'car-side',
    badge: 'Boot space',
    badgeTone: 'blue',
  },
];

export const PASSENGER_PORTAL_STEP3_FARE_ROWS = [
  { id: 'base', label: 'Base fare · 6.4 km', amount: 34 },
  { id: 'wait', label: 'Pickup waiting (5 min free)', amount: 0 },
  { id: 'handling', label: 'Handling', amount: 5 },
  { id: 'gst', label: 'GST (5%)', amount: 2 },
];

export const PASSENGER_PORTAL_TIMELINE = [
  {
    id: 'booked',
    title: 'Portal booked',
    time: '19:02',
    status: 'done',
  },
  {
    id: 'collected',
    title: 'Rider collected it',
    time: '19:14',
    status: 'done',
  },
  {
    id: 'transit',
    title: 'In transit to Koramangala',
    time: 'now',
    status: 'active',
  },
  {
    id: 'handed',
    title: 'Handed to Priya',
    time: 'expected 19:34',
    status: 'pending',
  },
];

export const PASSENGER_RENTALS_PACKAGES = [
  {
    id: '2h',
    hours: 2,
    label: '2 hours',
    km: 20,
    price: 649,
    afterKm: 12,
    beyondHr: 120,
  },
  {
    id: '4h',
    hours: 4,
    label: '4 hours',
    km: 40,
    price: 1199,
    afterKm: 12,
    beyondHr: 120,
  },
  {
    id: '8h',
    hours: 8,
    label: '8 hours',
    km: 80,
    price: 2199,
    afterKm: 11,
    beyondHr: 120,
  },
  {
    id: '12h',
    hours: 12,
    label: '12 hours',
    km: 120,
    price: 3099,
    afterKm: 11,
    beyondHr: 120,
  },
];

export const PASSENGER_RENTALS_VEHICLES = [
  {
    id: 'comfort',
    name: 'Comfort',
    model: 'Dzire',
    seats: 4,
    icon: 'car-side',
    priceAdd: 0,
  },
  {
    id: 'xl',
    name: 'XL',
    model: 'Ertiga',
    seats: 6,
    icon: 'car-estate',
    priceAdd: 850,
  },
  {
    id: 'premium',
    name: 'Premium',
    model: 'Honda City',
    seats: 4,
    icon: 'car-side',
    priceAdd: 1400,
  },
];

export const PASSENGER_REPORT_INCIDENTS = [
  { id: 'driving', label: 'Unsafe driving', iconType: 'feather', icon: 'alert-triangle' },
  { id: 'behaviour', label: 'Behaviour or\nharassment', iconType: 'feather', icon: 'users' },
  { id: 'vehicle', label: 'Vehicle condition', iconType: 'lucide', icon: 'car' },
  { id: 'route', label: 'Route deviation', iconType: 'feather', icon: 'map-pin' },
  { id: 'payment', label: 'Payment issue', iconType: 'mdi', icon: 'currency-inr' },
  { id: 'other', label: 'Something else', iconType: 'feather', icon: 'help-circle' },
];

export const PASSENGER_REPORT_SUB_CATEGORIES = [
  { id: 'waiting', label: 'Charged for waiting' },
  { id: 'surge', label: 'Surge unexpected' },
  { id: 'toll', label: 'Toll added' },
  { id: 'promo', label: 'Promo not applied' },
];

export const PASSENGER_SAFETY_SERIOUS_LEVELS = [
  { id: 'uncomfortable', label: 'Uncomfortable' },
  { id: 'unsafe', label: 'Unsafe' },
  { id: 'dangerous', label: 'Dangerous' },
];

export const PASSENGER_SAFETY_COMPLAINT_CATEGORIES = [
  { id: 'driver', label: 'Driver behaviour', iconType: 'feather', icon: 'alert-triangle' },
  { id: 'route', label: 'Unsafe route', iconType: 'feather', icon: 'map-pin' },
  { id: 'vehicle', label: 'Vehicle unsafe', iconType: 'lucide', icon: 'car' },
  { id: 'harassment', label: 'Harassment', iconType: 'feather', icon: 'users' },
];

export const PASSENGER_SAVE_PLACE_LABELS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'work', label: 'Work', icon: 'briefcase' },
  { id: 'other', label: 'Other', icon: 'map-pin' },
];

export const PASSENGER_SAVED_PLACES = [
  {
    id: 'home',
    section: 'pinned',
    name: 'Home',
    tag: 'Default pickup',
    address: '12, Brigade Road, Ashok Nagar, Bengaluru',
    landmark: '',
    note: '',
    icon: 'home',
    tone: 'orange',
  },
  {
    id: 'work',
    section: 'pinned',
    name: 'Work',
    tag: 'Weekday mornings',
    address: 'Prestige Tech Park, Marathahalli, Bengaluru',
    landmark: '',
    note: '',
    icon: 'briefcase',
    tone: 'orange',
  },
  {
    id: 'mums',
    section: 'other',
    name: "Mum's place",
    tag: null,
    address: '48, 4th Cross Road, Jayanagar 4th Block',
    landmark: 'Flat 3B, opposite the temple',
    note: '',
    icon: 'map-pin',
    tone: 'gray',
  },
  {
    id: 'gym',
    section: 'other',
    name: 'Gym',
    tag: null,
    address: 'Cult Fit, Indiranagar 100 Feet Road',
    landmark: '',
    note: '',
    icon: 'clock',
    tone: 'gray',
  },
];

export const PASSENGER_DATES_WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const PASSENGER_DATES_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const PASSENGER_DATES_SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const PASSENGER_DATES_QUICK = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: '30', label: '30 days' },
  { id: '90', label: '3 months' },
];

export const PASSENGER_SERVICES_RIDE_NOW = [
  {
    id: 'cab',
    label: 'Cab',
    meta: '4 seats · from ₹68',
    icon: 'car-side',
    badge: 'Most booked',
  },
  {
    id: 'auto',
    label: 'Auto',
    meta: '3 seats · from ₹48',
    icon: 'rickshaw',
  },
  {
    id: 'bike',
    label: 'Bike',
    meta: '1 seat · from ₹29',
    icon: 'motorbike',
  },
];

export const PASSENGER_SERVICES_PLAN_AHEAD = [
  {
    id: 'schedule',
    kicker: 'Book up to',
    title: 'Schedule a ride',
    icon: 'calendar',
  },
  {
    id: 'airport',
    kicker: 'Flight tracking and',
    title: 'Airport',
    icon: 'send',
  },
  {
    id: 'rentals',
    kicker: 'Keep the car',
    title: 'Rentals',
    icon: 'refresh-cw',
  },
  {
    id: 'outstation',
    kicker: 'One way or',
    title: 'Outstation',
    icon: 'route',
  },
];

export const PASSENGER_SET_ROUTE_RECENT_SAVED = [
  {
    id: 'home',
    title: 'Home',
    subtitle: '12, Brigade Road, Ashok Nagar',
    icon: 'home',
    address: '12, Brigade Road, Ashok Nagar',
  },
  {
    id: 'work',
    title: 'Work',
    subtitle: 'Prestige Tech Park, Marathahalli',
    icon: 'briefcase',
    address: 'Prestige Tech Park, Marathahalli',
  },
  {
    id: 'airport',
    title: 'Kempegowda Intl. Airport',
    subtitle: 'Terminal 2, Devanahalli · 38 km',
    icon: 'navigation',
    address: 'Kempegowda Intl. Airport, Terminal 2',
  },
  {
    id: 'phoenix',
    title: 'Phoenix Marketcity',
    subtitle: 'Whitefield Main Rd · 16 km',
    icon: 'map-pin',
    address: 'Phoenix Marketcity, Whitefield',
  },
];

export const PASSENGER_SET_ROUTE_SUGGESTIONS = [
  {
    id: 'indira-100',
    title: 'Indiranagar 100 Feet Road',
    subtitle: 'Indiranagar, Bengaluru · 4.2 km',
    address: 'Indiranagar 100 Feet Road',
  },
  {
    id: 'indira-metro',
    title: 'Indiranagar Metro Station',
    subtitle: '100 Feet Rd, Indiranagar · 4.5 km',
    address: 'Indiranagar Metro Station',
  },
  {
    id: 'indira-double',
    title: 'Indira Nagar Double Road',
    subtitle: 'Indiranagar, Bengaluru · 4.8 km',
    address: 'Indira Nagar Double Road',
  },
  {
    id: 'indira-fountain',
    title: 'Indira Gandhi Musical Fountain',
    subtitle: 'Cubbon Park · 6.1 km',
    address: 'Indira Gandhi Musical Fountain',
  },
  {
    id: 'mg-road',
    title: 'MG Road Metro Station',
    subtitle: 'MG Road, Bengaluru · 2.1 km',
    address: 'MG Road Metro Station',
  },
  {
    id: 'church',
    title: 'Church Street',
    subtitle: 'Shivaji Nagar, Bengaluru · 1.8 km',
    address: 'Church Street',
  },
  {
    id: 'koramangala',
    title: 'Koramangala 5th Block',
    subtitle: 'Koramangala, Bengaluru · 7.4 km',
    address: 'Koramangala 5th Block',
  },
  {
    id: 'nandi',
    title: 'Nandi Hills Summit',
    subtitle: 'Chikkaballapur · 60 km',
    address: 'Nandi Hills Summit',
    outOfArea: true,
    areaLabel: 'Nandi Hills',
  },
  {
    id: 'mysore',
    title: 'Mysore Palace',
    subtitle: 'Mysuru · 145 km',
    address: 'Mysore Palace',
    outOfArea: true,
    areaLabel: 'Mysore',
  },
  {
    id: 'coorg',
    title: 'Coorg Madikeri',
    subtitle: 'Kodagu · 260 km',
    address: 'Coorg Madikeri',
    outOfArea: true,
    areaLabel: 'Coorg',
  },
];

export const PASSENGER_SET_ROUTE_STOP_POOL = [
  'Trinity Metro Station',
  'Ulsoor Lake gate 3',
  'MG Road Metro',
  'Cubbon Park Gate',
  'Indiranagar Metro',
];

export const SETUP_ACCOUNT_STRINGS = {
  SUPPORT_URL: 'mailto:support@cabora.app',
  HEADER_TITLE: 'Set up your account',
  TITLE: 'How will you use Cabora?',
  SUBTITLE: 'You can add the other role later from your profile — one account holds both.',
  DRIVER_NOTE: 'Driver accounts need a licence, RC, insurance and a bank account before going online.',
  PICKED_LABEL: 'You picked',
  CONTINUE_BTN: 'Continue',
};

export const PASSENGER_SETUP_ACCOUNT_ROLES = [
  {
    id: 'passenger',
    label: 'Passenger',
    title: 'Ride as a passenger',
    body: 'Book cabs, autos, bikes, Portal deliveries and outstation trips.',
    hint: 'Ready in a minute',
    tone: 'success',
  },
  {
    id: 'driver',
    label: 'Driver',
    title: 'Drive and earn',
    body: 'Accept rides, track earnings and withdraw daily.',
    hint: 'Needs KYC · about 2 days',
    tone: 'warning',
  },
];

export const PASSENGER_SHARE_LIVE_CONTACTS = [
  { id: 'priya', initials: 'PM', name: 'Priya', selected: true },
  { id: 'vikram', initials: 'VM', name: 'Vikram', selected: true },
  { id: 'ananya', initials: 'AS', name: 'Ananya', selected: false },
];

export const PASSENGER_TRUSTED_CONTACTS_INITIAL = [
  {
    id: 'c1',
    initials: 'PS',
    name: 'Priya Sharma',
    meta: 'Sister · +91 98450 33119',
    avatarBg: colors.orange.avatarBg,
    avatarFg: colors.orange[850],
    autoShare: true,
    alertSos: true,
  },
  {
    id: 'c2',
    initials: 'VS',
    name: 'Vikram Sharma',
    meta: 'Father · +91 98450 21004',
    avatarBg: colors.blue.lightBadge,
    avatarFg: colors.blue[700],
    autoShare: true,
    alertSos: false,
  },
  {
    id: 'c3',
    initials: 'NK',
    name: 'Neha Kulkarni',
    meta: 'Friend · +91 99010 55218',
    avatarBg: colors.green[200],
    avatarFg: colors.green[700],
    autoShare: false,
    alertSos: true,
  },
];

export const PASSENGER_TRUSTED_CONTACTS_PRIVACY = [
  { ok: true, text: 'Your live location while a trip is running' },
  { ok: true, text: 'Driver name, photo and vehicle number' },
  { ok: false, text: 'Your home address or saved places' },
];

export const PASSENGER_WALKTHROUGH_SLIDES = [
  {
    key: 'booking',
    image: images.walkBooking,
    curve: images.walkCurveBooking,
    kicker: 'FAST BOOKING',
    title: 'Book a ride\nin three taps.',
    body: 'Set your drop, pick a vehicle, confirm. No forms, no waiting on hold.',
    action: 'Continue',
  },
  {
    key: 'tracking',
    image: images.walkTracking,
    curve: images.walkCurveTracking,
    kicker: 'LIVE TRACKING',
    title: 'See every metre\nof the way.',
    body: 'Live driver position, honest ETAs, and a link your family can follow.',
    action: 'Continue',
  },
  {
    key: 'payments',
    image: images.walkPayments,
    curve: images.walkCurvePayments,
    contain: true,
    kicker: 'SECURE PAYMENTS',
    title: 'Pay however\nsuits you.',
    body: 'UPI, cards, wallet or cash. Fares are locked before you book — no surprises.',
    action: 'Get started',
  },
];

export const PASSENGER_WALLET_TABS = [
  { id: 'all', label: 'All' },
  { id: 'credits', label: 'Credits' },
  { id: 'debits', label: 'Debits' },
];

export const PASSENGER_WALLET_TXNS = [
  {
    id: 't1',
    type: 'debit',
    title: 'Cab Sedan to Airport',
    meta: 'Today 12:24 pm · CBR8241905',
    amount: '- ₹241.50',
    status: 'Paid',
    icon: 'car',
    iconTone: 'navy',
  },
  {
    id: 't2',
    type: 'credit',
    title: 'Added money',
    meta: 'Yesterday 9:10 pm · UPI',
    amount: '+ ₹500.00',
    status: 'Success',
    icon: 'plus',
    iconTone: 'green',
  },
  {
    id: 't3',
    type: 'credit',
    title: 'Refund · Cancelled Auto',
    meta: 'Fri 11 Sep · CBR8192044',
    amount: '+ ₹30.00',
    status: 'Refunded',
    icon: 'rotate-ccw',
    iconTone: 'blue',
  },
  {
    id: 't4',
    type: 'credit',
    title: 'Referral bonus',
    meta: 'Thu 10 Sep · Promo',
    amount: '+ ₹100.00',
    status: 'Success',
    icon: 'gift',
    iconTone: 'orange',
  },
  {
    id: 't5',
    type: 'debit',
    title: 'Bike to Koramangala',
    meta: 'Wed 9 Sep · CBR8102211',
    amount: '- ₹41.00',
    status: 'Paid',
    icon: 'bike',
    iconTone: 'navy',
  },
];

// Sidebar Navigation Tab Screens
export const SIDEBAR_TAB_SCREENS = [
  'Dashboard',
  'Earnings',
  'Wallet',
  'Incentives',
  'Profile',
  'Home',
  'Services',
  'Activity',
];
export const tabScreens = SIDEBAR_TAB_SCREENS;

// Payment Methods
export const PASSENGER_PAYMENT_TYPES = ['UPI', 'Cash', 'Wallet', 'Card'];
export const PAYMENTS = PASSENGER_PAYMENT_TYPES;

// Default OTP Array
export const DEFAULT_OTP_ARRAY = ['4', '8', '2', '6'];
export const otp = DEFAULT_OTP_ARRAY;

// Help Screen Topics & FAQs
export const PASSENGER_HELP_TOPICS = [
  { id: 'fares', title: 'Fares & payments', iconType: 'text', icon: '₹' },
  { id: 'safety', title: 'Safety', iconType: 'feather', icon: 'shield' },
  { id: 'lost', title: 'Lost an item', iconType: 'feather', icon: 'shopping-bag' },
  { id: 'account', title: 'Account & profile', iconType: 'feather', icon: 'user' },
  { id: 'driver', title: 'Driver behaviour', iconType: 'lucide', icon: 'car' },
  { id: 'offers', title: 'Offers & referrals', iconType: 'feather', icon: 'gift' },
];
export const TOPICS = PASSENGER_HELP_TOPICS;

export const PASSENGER_HELP_FAQS = [
  { id: 'cancel', question: 'Why was I charged a cancellation fee?' },
  { id: 'surge', question: 'How do surge prices work?' },
];
export const FAQS = PASSENGER_HELP_FAQS;

// Safety Tools
export const PASSENGER_SAFETY_TOOLS = [
  {
    id: 'sos',
    title: 'Emergency SOS',
    sub: 'Alert local police & contacts',
    iconBg: 'red',
  },
  {
    id: 'contacts',
    title: 'Trusted contacts',
    sub: 'Share trip details automatically',
    iconBg: 'blue',
  },
  {
    id: 'share',
    title: 'Share live trip',
    sub: 'Auto-share after 9:00 PM is ON',
    iconBg: 'sky',
  },
  {
    id: 'check',
    title: 'Ride check',
    sub: 'Auto-detect long unexpected stops',
    iconBg: 'green',
  },
  {
    id: 'report',
    title: 'Report an incident',
    sub: 'Anonymous option available',
    iconBg: 'amber',
  },
  {
    id: 'tips',
    title: 'Safety tips',
    sub: 'Before, during and after a ride',
    iconBg: 'gray',
  },
];
export const TOOLS = PASSENGER_SAFETY_TOOLS;


export const ITEMS_LIST = SEARCH_ITEMS_LIST;

