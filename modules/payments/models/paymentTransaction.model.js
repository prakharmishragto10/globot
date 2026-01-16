import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema(
  {
    paymentOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentOrder",
      required: true,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    razorpaySignature: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    method: {
      type: String, // upi, card, netbanking
      index: true,
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
      index: true,
    },

    verified: {
      type: Boolean,
      default: false,
      index: true,
    },

    gatewayResponse: {
      type: Object,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentTransaction", paymentTransactionSchema);
