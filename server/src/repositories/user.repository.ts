import { User, type IUser } from "../models/user.model.js";
import type { Role } from "../types/enums.js";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
  operatorId?: string;
}

export function createUser(input: CreateUserInput): Promise<IUser> {
  return User.create(input);
}

export function findByEmailWithPassword(email: string): Promise<IUser | null> {
  return User.findOne({ email: email.toLowerCase() }).select("+password");
}

export function findById(id: string): Promise<IUser | null> {
  return User.findById(id);
}
