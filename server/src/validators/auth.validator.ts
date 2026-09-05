import { z } from "zod";
import { Role } from "../types/enums.js";

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().trim().optional(),
    role: z.enum(Role).optional(),
    operatorId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === Role.OPERATOR && !data.operatorId) {
      ctx.addIssue({
        code: "custom",
        message: "operatorId is required when role is OPERATOR",
        path: ["operatorId"],
      });
    }
  });

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
