import { Schema, model, Types, type Document } from "mongoose";
import bcrypt from "bcryptjs";
import { Role } from "../types/enums.js";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
  operatorId?: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(passwordInput: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.PASSENGER,
    },
    operatorId: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
      required: function (this: IUser) {
        return this.role === Role.OPERATOR;
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (passwordInput: string) {
  return bcrypt.compare(passwordInput, this.password);
};

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    Reflect.deleteProperty(ret, "password");
    return ret;
  },
});

export const User = model<IUser>("User", userSchema);
