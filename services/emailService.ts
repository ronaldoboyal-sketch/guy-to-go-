import { User, Product, PaymentRequest } from '../types';

export const EmailService = {
  sendWelcomeEmail: (user: User) => {
    console.log(`
      [EMAIL SERVICE] Sending Welcome Email to: ${user.email}
      ------------------------------------------------------
      Subject: Welcome to Guy to Go!
      Body:
      Hi ${user.name},
      
      Welcome to Guy to Go - Your premier platform for educational resources in Guyana.
      
      Getting Started:
      1. Browse our store for Ministry-approved guides.
      2. Check out the AI Lesson Planner (Subscription required).
      3. Complete your profile.
      
      Regards,
      The Guy to Go Team
      ------------------------------------------------------
    `);
  },

  sendProductAlert: (product: Product, users: User[]) => {
    console.log(`
      [EMAIL SERVICE] Sending Newsletter to ${users.length} users
      ------------------------------------------------------
      Subject: New Resource Available: ${product.title}
      ------------------------------------------------------
    `);
  },
  
  sendPaymentUpdate: (user: User, request: PaymentRequest, status: string) => {
     const isApproved = status === 'ACTIVE' || status === 'APPROVED';
     const subject = isApproved 
        ? `🎉 Payment Approved - Guy to Go` 
        : `⚠️ Payment Update - Guy to Go`;
     
     let messageBody = '';

     if (isApproved) {
         if (request.type === 'SUBSCRIPTION') {
             messageBody = `
      We are pleased to inform you that your MMG payment has been verified.
      
      ✅ Your Subscription is now ACTIVE.
      
      You have full, unlimited access to the AI Lesson Planner compliant with the MoE Renewed Curriculum.
      Login now to start planning: https://guytogo.com/lesson-planner
             `;
         } else {
             messageBody = `
      We are pleased to inform you that your MMG payment has been verified.
      
      ✅ Your Order #${request.id.substring(0,8)} is APPROVED.
      
      You can now access and download your purchased resources from your Profile under "My Digital Library".
      Access your files here: https://guytogo.com/profile
             `;
         }
     } else {
         messageBody = `
      We regret to inform you that we could not verify your recent payment transaction (${request.transactionId}).
      
      ❌ Request Status: DECLINED
      
      Please ensure you have transferred the correct amount to the correct MMG number.
      If you believe this is an error, please reply to this email or contact support with a screenshot of your receipt.
         `;
     }

     console.log(`
      [EMAIL SERVICE] 📨 AUTOMATED EMAIL DISPATCH
      ------------------------------------------------------
      To: ${user.email}
      Subject: ${subject}
      ------------------------------------------------------
      Dear ${user.name},

      ${messageBody}
      
      Thank you for choosing Guy to Go.

      Best Regards,
      Management Team
      Guy to Go Systems
      ------------------------------------------------------
    `);
  }
};