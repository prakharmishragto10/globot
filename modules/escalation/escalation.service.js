import EscalationRequest from "./escalation.model.js";

export const createEscalation = async ({ sessionId, leadId, reason }) => {
  return EscalationRequest.create({
    sessionId,
    leadId,
    reason,
  });
};
