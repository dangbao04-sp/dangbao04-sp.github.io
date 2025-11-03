

export interface Service {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  discountPrice?: number;
  duration: number; // in minutes
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isHot?: boolean;
  isNew?: boolean;
  promoExpiryDate?: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending' | 'in-progress'; // Added 'in-progress'
  therapist?: string; // Name of the therapist
  therapistId?: string; // ID of the therapist
  room?: string; // New: Room for the appointment
  notesForTherapist?: string; // New: Special notes for the therapist
  staffNotesAfterSession?: string; // New: Notes added by staff after session
  isStarted?: boolean; // New: Indicates if the session has started
  isCompleted?: boolean; // New: Indicates if the session has been completed
}

export type UserRole = 'Admin' | 'Manager' | 'Technician' | 'Receptionist' | 'Client';
export type UserStatus = 'Active' | 'Inactive' | 'Locked';
export type StaffTierName = 'Mới' | 'Thành thạo' | 'Chuyên gia'; // New: Staff tiers

export interface LoginAttempt {
    date: string;
    ip: string;
    device: string;
    isUnusual: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  profilePictureUrl: string;
  joinDate: string;
  birthday: string; // MM-DD format
  tierLevel: number;
  selfCareIndex: number; // A number from 0 to 100
  gender?: string;
  isAdmin?: boolean;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  loginHistory?: LoginAttempt[];
  specialty?: string[]; // Changed to string[] for staff roles like Technician, Manager
  experience?: string; // For staff roles
  totalSpending?: number; // New: Total spending by the user
  lastTierUpgradeDate?: string; // New: Date of last tier upgrade
  staffTier?: StaffTierName; // New: Tier for staff members
  commissionRate?: number; // New: Commission rate for staff (e.g., 0.1 for 10%)
  qrCodeUrl?: string; // New: Personal QR code for staff
}

export type PromotionTargetAudience = 'All' | 'New Clients' | 'Birthday' | 'VIP' | 'Tier Level 1' | 'Tier Level 2' | 'Tier Level 3' | 'Tier Level 4' | 'Tier Level 5' | 'Tier Level 6' | 'Tier Level 7' | 'Tier Level 8';

export interface Promotion {
    id: string;
    title: string;
    description: string;
    code: string;
    expiryDate: string;
    imageUrl: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    termsAndConditions: string;
    targetAudience?: PromotionTargetAudience; // New: Who is this promotion for?
    applicableServiceIds?: string[]; // New: Which services apply? Empty means all.
    minOrderValue?: number; // New: Minimum order value for discount to apply
    usageCount?: number; // New: For reporting, how many times used (mock)
}

export interface Review {
  id: string;
  serviceId: string;
  userName: string;
  userImageUrl: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Wallet {
    balance: number;
    points: number;
    spinsLeft?: number;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

export interface TreatmentSession {
  date: string;
  therapist: string;
  notes: string;
  beforeAfterImages?: string[]; // New: Images for treatment progress
  therapistNotes?: string; // New: Detailed notes from therapist
  afterSessionImageUrl?: string; // New: Single image after session
  status?: 'completed' | 'in-progress' | 'upcoming'; // New: Status of a single session
}

export interface TreatmentCourse {
  id: string;
  serviceId: string;
  serviceName: string;
  totalSessions: number;
  sessions: TreatmentSession[];
  clientId: string; // New: Client associated with this course
  therapistId: string; // New: Therapist responsible for this course
  status: 'active' | 'completed' | 'paused'; // New: Status of the course
}

export interface Therapist {
  id: string;
  name: string;
  specialty: string[]; // Changed to string[]
  imageUrl: string;
  rating: number;
  reviewCount: number;
  experience?: string; // Added for staff details
}

export interface PointsHistory {
    id: string;
    date: string;
    description: string;
    pointsChange: number; // positive for earning, negative for spending
}

export interface RedeemableVoucher {
    id: string;
    description: string;
    pointsRequired: number;
    value: number; // in VND
    applicableServiceIds?: string[]; // New: Which services apply? Empty means all.
    targetAudience?: 'All' | 'VIP' | 'Tier Level 1' | 'Tier Level 2' | 'Tier Level 3' | 'Tier Level 4' | 'Tier Level 5' | 'Tier Level 6' | 'Tier Level 7' | 'Tier Level 8'; // New: Who can redeem this voucher?
}

export interface Tier {
    level: number;
    name: string;
    pointsRequired: number;
    minSpendingRequired: number; // New: Minimum spending required for this tier
    color: string; // hex color for glow/accents
    textColor: string;
}

export interface RedeemedReward {
  id: string;
  userId: string;
  rewardDescription: string;
  pointsUsed: number;
  dateRedeemed: string; // ISO string
}

export interface Mission {
    id: string;
    title: string;
    points: number;
    isCompleted: boolean;
}

export type PaymentStatus = 'Completed' | 'Pending' | 'Refunded';
export type PaymentMethod = 'Cash' | 'Card' | 'Momo' | 'VNPay' | 'ZaloPay';

export interface Payment {
    id: string;
    transactionId: string;
    userId: string;
    appointmentId?: string; // Optional: A payment might be for a product directly, not tied to an appointment
    serviceName?: string; // Optional: If payment is for a service
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    date: string; // ISO string
    therapistId?: string; // New: Therapist who performed the service for commission tracking
    productId?: string; // New: If payment is for a product sale
}

export interface StaffScheduleSlot {
    id: string;
    therapistId: string;
    date: string;
    time: string;
    serviceName: string;
    status: 'scheduled' | 'completed' | 'cancelled';
}

export interface StaffDailyAvailability {
  id: string; // Unique ID for the availability record
  staffId: string;
  date: string; // YYYY-MM-DD
  timeSlots: {
    time: string; // e.g., '09:00'
    availableServiceIds: string[]; // Service IDs this staff can perform at this time
  }[];
}

// NEW INTERFACES FOR STAFF PORTAL
export interface StaffTier {
  id: StaffTierName;
  name: string;
  minAppointments: number; // Minimum completed appointments for this tier
  minRating: number; // Minimum average rating for this tier
  commissionBoost?: number; // Optional: % boost to commission rate
  color: string;
  badgeImageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  stock: number; // New: Stock count
}

export interface Sale {
  id: string;
  staffId: string;
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  date: string; // ISO string
  status: 'completed' | 'pending' | 'returned';
  clientId?: string; // New: Client who bought the product
  paymentId?: string; // New: Link to payment if separate
}

export interface InternalNotification {
  id: string;
  recipientId: string; // User ID of staff or client, 'all' for all staff/clients
  recipientType: 'staff' | 'client' | 'all'; // New: Type of recipient
  type: 'appointment_new' | 'appointment_cancelled' | 'shift_change' | 'admin_message' | 'promo_alert' | 'system_news' | 'client_feedback'; // Added client_feedback
  message: string;
  date: string; // ISO string
  isRead: boolean;
  link?: string; // Optional link to relevant page
  relatedAppointmentId?: string; // New: Link to appointment for client feedback
}

export interface InternalNews {
  id: string;
  title: string;
  content: string;
  authorId: string; // User ID of Admin/Manager
  date: string; // ISO string
  priority: 'low' | 'medium' | 'high';
}

export interface StaffShift {
  id: string;
  staffId: string;
  date: string; // YYYY-MM-DD
  shiftType: 'morning' | 'afternoon' | 'evening' | 'leave'; // e.g., '09:00-13:00', '13:00-17:00', '17:00-21:00'
  status: 'approved' | 'pending' | 'rejected'; // For leave/swap requests
  requestedBy?: string; // For swap requests (staffId)
  notes?: string; // Notes for manager approval
  assignedManagerId?: string; // Manager who approved/rejected
  shiftHours?: { start: string; end: string }; // Actual hours if different from standard shiftType
}