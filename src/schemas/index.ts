import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short").max(80),
    email: z.string().trim().email("Enter a valid email").max(255),
    phone: z
      .string()
      .trim()
      .min(7, "Enter a valid phone")
      .max(20)
      .regex(/^[+\d\s()-]+$/, "Enter a valid phone"),
    password: z.string().min(8, "At least 8 characters").max(100),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
});

const imageField = z.union([z.string().min(1, "Image is required"), z.instanceof(File)]);

export const serviceSchema = z.object({
  name: z.string().trim().min(2).max(80),
  category: z.string().trim().min(2).max(40),
  description: z.string().trim().min(10).max(500),
  duration: z.coerce.number().int().min(10).max(300),
  price: z.coerce.number().min(0).max(100000),
  active: z.boolean(),
  image: imageField,
});

export const teamSchema = z.object({
  name: z.string().trim().min(2).max(80),
  position: z.string().trim().min(2).max(60),
  specialization: z.string().trim().min(2).max(100),
  experience: z.coerce.number().int().min(0).max(60),
  bio: z.string().trim().min(10).max(600),
  image: imageField,
});

export const gallerySchema = z.object({
  title: z.string().trim().max(120).default(""),
  caption: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(40),
  visible: z.boolean(),
  image: imageField,
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(10).max(1000),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type ServiceValues = z.infer<typeof serviceSchema>;
export type TeamValues = z.infer<typeof teamSchema>;
export type GalleryValues = z.infer<typeof gallerySchema>;
export type ContactValues = z.infer<typeof contactSchema>;
