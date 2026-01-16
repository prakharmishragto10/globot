import mongoose from "mongoose";

//creation of webhook event

const paymentWebhookEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      required: true,
    },
    payload: {
      type: Object,
      required: true,
    },
    processed: {
      type: Boolean,
      default: false,
      index: true,
    },
    processedAt: Date,
  },
  { timestamps: true }
);
export default mongoose.model("PaymentWebHookEvent", paymentWebhookEventSchema);
