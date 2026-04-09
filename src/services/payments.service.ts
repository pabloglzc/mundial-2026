'use client';

import { Payment } from './types';
import { generateId } from '@/lib/utils';
import { authService } from './auth.service';

const PAYMENTS_KEY = 'mundial2026_payments';

function getPayments(): Payment[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PAYMENTS_KEY);
  return data ? JSON.parse(data) : [];
}

function savePayments(payments: Payment[]) {
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
}

export const paymentsService = {
  async submitPayment(userId: string, method: string): Promise<Payment> {
    const payments = getPayments();
    const payment: Payment = {
      id: generateId(),
      userId,
      amount: 500,
      method,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };
    payments.push(payment);
    savePayments(payments);
    await authService.updatePaymentStatus(userId, 'submitted');
    return payment;
  },

  async verifyPayment(paymentId: string, adminId: string): Promise<void> {
    const payments = getPayments();
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
      payment.status = 'verified';
      payment.verifiedAt = new Date().toISOString();
      payment.verifiedBy = adminId;
      savePayments(payments);
      await authService.updatePaymentStatus(payment.userId, 'verified');
    }
  },

  async getUserPayment(userId: string): Promise<Payment | null> {
    return getPayments().find(p => p.userId === userId) || null;
  },

  async getAllPayments(): Promise<Payment[]> {
    return getPayments();
  },

  async getPendingPayments(): Promise<Payment[]> {
    return getPayments().filter(p => p.status === 'submitted');
  },
};
