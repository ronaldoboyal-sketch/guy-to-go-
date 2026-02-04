import { Product, PaymentRequest, User, SubscriptionStatus, UserRole, LessonPlanHistoryItem } from '../types';
import { INITIAL_PRODUCTS, MOCK_ADMIN_USER, MOCK_TEACHER_USER, ADMIN_EMAIL } from '../constants';

const KEYS = {
  USER: 'guytogo_user', // Current session
  USERS_DB: 'guytogo_users_db', // Persistent user database
  PRODUCTS: 'guytogo_products',
  PAYMENTS: 'guytogo_payments',
  CART: 'guytogo_cart',
  LESSON_PLANS: 'guytogo_lesson_plans'
};

export const StorageService = {
  // --- User Database & Session Management ---

  // Initialize DB with mock users if empty
  initUserDB: () => {
    const data = localStorage.getItem(KEYS.USERS_DB);
    let users: User[] = data ? JSON.parse(data) : [];

    // Ensure the specific Admin user exists and has the correct password
    const adminIndex = users.findIndex(u => u.email === ADMIN_EMAIL);
    if (adminIndex >= 0) {
        // Update existing admin
        users[adminIndex] = {
            ...users[adminIndex],
            password: MOCK_ADMIN_USER.password,
            role: UserRole.ADMIN // Ensure role stays ADMIN
        };
    } else {
        // Create admin if missing
        users.push({
            ...MOCK_ADMIN_USER,
            joinedAt: new Date().toISOString(),
            purchasedProductIds: []
        });
    }

    // Ensure Mock Teacher exists
    const teacherExists = users.find(u => u.email === MOCK_TEACHER_USER.email);
    if (!teacherExists) {
        users.push({
            ...MOCK_TEACHER_USER,
            joinedAt: new Date().toISOString(),
            purchasedProductIds: []
        });
    }

    localStorage.setItem(KEYS.USERS_DB, JSON.stringify(users));
  },

  getAllUsers: (): User[] => {
    StorageService.initUserDB();
    const data = localStorage.getItem(KEYS.USERS_DB);
    return data ? JSON.parse(data) : [];
  },

  saveUserToDB: (user: User) => {
    const users = StorageService.getAllUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    // Ensure purchasedProductIds exists
    if (!user.purchasedProductIds) user.purchasedProductIds = [];

    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS_DB, JSON.stringify(users));

    // If updating the currently logged in user, update session too
    const currentUser = StorageService.getUser();
    if (currentUser && currentUser.id === user.id) {
        StorageService.setUser(user);
    }
  },

  // Get current session user
  getUser: (): User | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  // Set current session user
  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.USER);
    }
  },

  // --- Product Management ---
  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  },

  addProduct: (product: Product) => {
    const products = StorageService.getProducts();
    const updated = [...products, product];
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
  },

  deleteProduct: (id: string) => {
    const products = StorageService.getProducts();
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
  },

  // --- Payment Requests (Subscriptions & Orders) ---
  getPaymentRequests: (): PaymentRequest[] => {
    const data = localStorage.getItem(KEYS.PAYMENTS);
    return data ? JSON.parse(data) : [];
  },

  addPaymentRequest: (request: PaymentRequest) => {
    const reqs = StorageService.getPaymentRequests();
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify([...reqs, request]));
  },

  // Admin approves/rejects payment
  updatePaymentStatus: (id: string, status: SubscriptionStatus) => {
    const reqs = StorageService.getPaymentRequests();
    const targetReq = reqs.find(r => r.id === id);
    
    const updatedReqs = reqs.map(r => r.id === id ? { ...r, status } : r);
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(updatedReqs));
    
    // Logic to grant access upon approval
    if (targetReq && (status === SubscriptionStatus.ACTIVE || status === SubscriptionStatus.APPROVED)) {
        const users = StorageService.getAllUsers();
        const userIndex = users.findIndex(u => u.id === targetReq.userId);
        
        if (userIndex >= 0) {
            const user = users[userIndex];
            
            if (targetReq.type === 'SUBSCRIPTION') {
                user.subscriptionStatus = SubscriptionStatus.ACTIVE;
            } else if (targetReq.type === 'ORDER' && targetReq.items) {
                const newProductIds = targetReq.items.map(i => i.id);
                user.purchasedProductIds = Array.from(new Set([...(user.purchasedProductIds || []), ...newProductIds]));
            }
            
            StorageService.saveUserToDB(user);
        }
    }
  },

  // --- Lesson Plan History ---
  getAllLessonPlans: (): LessonPlanHistoryItem[] => {
      const data = localStorage.getItem(KEYS.LESSON_PLANS);
      return data ? JSON.parse(data) : [];
  },

  getUserLessonPlans: (userId: string): LessonPlanHistoryItem[] => {
      const all = StorageService.getAllLessonPlans();
      return all.filter(plan => plan.userId === userId).reverse(); // Newest first
  },

  saveLessonPlan: (plan: LessonPlanHistoryItem) => {
      const all = StorageService.getAllLessonPlans();
      // Optional: Limit history size to prevent localStorage quota exceeded
      // Keeping last 50 plans globally for now
      const updated = [...all, plan];
      if (updated.length > 50) {
          updated.shift(); // Remove oldest
      }
      localStorage.setItem(KEYS.LESSON_PLANS, JSON.stringify(updated));
  },
  
  deleteLessonPlan: (id: string) => {
      const all = StorageService.getAllLessonPlans();
      const updated = all.filter(p => p.id !== id);
      localStorage.setItem(KEYS.LESSON_PLANS, JSON.stringify(updated));
  }
};