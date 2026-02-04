import { Product, User, UserRole, SubscriptionStatus } from './types';

export const ADMIN_EMAIL = 'ronaldoboya100@gmail.com';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Grade 6 National Assessment Prep Kit',
    description: 'Comprehensive guide covering Mathematics, English, Science, and Social Studies for NGSA preparation.',
    price: 5000,
    category: 'Exam Prep',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    fileUrl: '#',
    resourceType: 'PDF'
  },
  {
    id: '2',
    title: 'Renewed Literacy Curriculum Guide (Grade 1-2)',
    description: 'Official style guide and lesson structures for early childhood literacy.',
    price: 2500,
    category: 'Curriculum Guides',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    fileUrl: '#',
    resourceType: 'PDF'
  },
  {
    id: '3',
    title: 'Interactive Science Worksheets - Grade 4',
    description: 'Printable worksheets focusing on local flora and fauna of Guyana.',
    price: 1500,
    category: 'Worksheets',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    fileUrl: '#',
    resourceType: 'PDF'
  },
  {
    id: '4',
    title: 'CSEC Social Studies Pocket Guide',
    description: 'Quick revision notes for Caribbean secondary education students.',
    price: 3000,
    category: 'Secondary',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    fileUrl: '#',
    resourceType: 'PDF'
  }
];

export const MOCK_ADMIN_USER: User = {
  id: 'admin-100',
  email: ADMIN_EMAIL,
  name: 'Ronaldo Boyal',
  role: UserRole.ADMIN,
  subscriptionStatus: SubscriptionStatus.ACTIVE,
  avatarUrl: 'https://picsum.photos/100/100?random=10',
  purchasedProductIds: [],
  password: btoa('WhatIsYourName@2305')
};

export const MOCK_TEACHER_USER: User = {
  id: 'teacher-456',
  email: 'teacher@school.gy',
  name: 'Sarah Singh',
  role: UserRole.TEACHER,
  subscriptionStatus: SubscriptionStatus.NONE,
  avatarUrl: 'https://picsum.photos/100/100?random=11',
  purchasedProductIds: [],
  password: btoa('password123')
};

export const MMG_INSTRUCTIONS = `To complete your purchase/subscription, please transfer the total amount via MMG to:
Number: 6727505
Name: Ronaldo Boyal`;
