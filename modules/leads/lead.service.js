import Lead from "./lead.model.js";

//create a lead right now

export const getOrCreateLead = async (sessionId) => {
  let lead = await Lead.findOne({ sessionId }); //db query to find a lead/

  //creating a lead if the lead is not there
  if (!lead) {
    lead = await Lead.create({ sessionId });
  }

  //we return the either the lead or we return the lead by  creting a new one
  return lead;
};

// Update one field in lead
export const updateLeadField = async (sessionId, field, value) => {
  return Lead.findOneAndUpdate(
    { sessionId },
    { [field]: value },
    { new: true }
  );
};

//check for a qualified lead

export const isLeadQualified = (lead) => {
  return (
    lead.fullName &&
    lead.phone &&
    lead.email &&
    lead.intendedCountry &&
    lead.intendedCourse
  );
};
