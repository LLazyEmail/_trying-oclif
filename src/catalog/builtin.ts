/**
 * Built-in stub catalog.
 * Shapes are taken from the Postmark transactional set, a lead nurture,
 * and a newsletter — enough for the CLI to list, render, and assert.
 *
 * @packageDocumentation
 */

import type {CatalogEntry} from './types.js'

export const BUILTIN_CATALOG: readonly CatalogEntry[] = Object.freeze([
  {
    ids: ['WelcomeEmail'],
    aliases: ['welcome'],
    kind: 'transactional',
    description: 'Welcome email after sign-up',
    fileName: 'welcome.html',
    samplePayload: {
      name: 'Alex',
      productName: 'LLazyEmail',
      actionUrl: 'https://example.com/get-started',
    },
  },
  {
    ids: ['PasswordResetEmail'],
    aliases: ['password-reset', 'reset'],
    kind: 'transactional',
    description: 'Password reset link',
    fileName: 'password-reset.html',
    samplePayload: {
      name: 'Alex',
      actionUrl: 'https://example.com/reset?token=demo',
      expiresIn: '30 minutes',
    },
  },
  {
    ids: ['InvoiceEmail'],
    aliases: ['invoice'],
    kind: 'transactional',
    description: 'Invoice / receipt',
    fileName: 'invoice.html',
    samplePayload: {
      name: 'Alex',
      invoiceId: 'INV-1001',
      amount: '$49.00',
      actionUrl: 'https://example.com/invoices/INV-1001',
    },
  },
  {
    ids: ['LeadNurtureEmail'],
    aliases: ['lead', 'lead-nurture'],
    kind: 'lead',
    description: 'Lead nurture follow-up',
    fileName: 'lead-nurture.html',
    samplePayload: {
      name: 'Alex',
      company: 'Northwind',
      offer: 'a free template audit',
      actionUrl: 'https://example.com/book',
    },
  },
  {
    ids: ['NewsletterEmail'],
    aliases: ['newsletter'],
    kind: 'newsletter',
    description: 'Markdown newsletter shell',
    fileName: 'newsletter.html',
    samplePayload: {
      subject: 'This week in email',
      preview: 'Three things worth reading',
      title: 'This week in email',
    },
  },
])
