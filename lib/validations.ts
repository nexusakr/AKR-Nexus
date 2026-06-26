import { z } from "zod";

const enquiryValues = [
  "general",
  "consultation",
  "investor",
  "partner",
  "nri",
  "dham",
] as const;

/** Schema for all public lead/enquiry submissions. */
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  mobile: z
    .string()
    .trim()
    .min(7, "Please enter a valid mobile number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Mobile number looks invalid"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .max(160)
    .optional()
    .or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  enquiry_type: z.enum(enquiryValues).default("general"),
  interest_type: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  lead_source: z.string().trim().max(200).optional().or(z.literal("")),
  // Honeypot — must stay empty (bots fill it).
  company: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Newsletter / lead-magnet subscription. */
export const subscribeSchema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(160),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  source: z.string().trim().max(120).optional().or(z.literal("")),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
