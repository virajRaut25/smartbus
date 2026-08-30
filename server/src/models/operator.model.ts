import { Schema, model, type Document } from "mongoose";

export interface IOperator extends Document {
  name: string;
  contactEmail: string;
  contactPhone?: string;
  licenseNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const operatorSchema = new Schema<IOperator>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Operator = model<IOperator>("Operator", operatorSchema);
