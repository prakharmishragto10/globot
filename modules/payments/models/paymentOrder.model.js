import mongoose from "mongoose";

const paymentOrderSchema = new mongoose.Schema(
  {
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    amount: {
      type: Number, //paise
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
      index: true,
    },
  },
  { timestamps: true }
);
//code that will prevent duplicate id creation
paymentOrderSchema.index(
  { registrationId: 1, status: 1 },
  { partialFilterExpression: { status: "created" } }
);
export default mongoose.model("PaymentOrder", paymentOrderSchema);
