import { z } from "zod";

export const requiredBodySignup = z.object({
  email: z
    .string()
    .min(7, { message: "Email must be at least 7 characters" })
    .max(60, { message: "Email must be less than 60 characters" })
    .email({ message: "Invalid email format" }),

  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" })
    .max(60, { message: "Username must be less than 60 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),

  password: z
    .string()
    .min(10, { message: "Password must be at least 10 characters" })
    .max(50, { message: "Password must be less than 50 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export const requiredBodySignin = z.object({
  email: z
    .string()
    .min(7, { message: "Email must be at least 7 characters" })
    .max(60, { message: "Email must be less than 60 characters" })
    .email({ message: "Invalid email format" }),

  password: z
    .string()
    .min(10, { message: "Password must be at least 10 characters" })
    .max(50, { message: "Password must be less than 50 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export const createRoomSchema = z.object({
  name: z.string().min(2).max(60),
});
