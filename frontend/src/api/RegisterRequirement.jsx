import axios from "axios";

export default async function RegisterRequirement(
  requirementName,
  description
) {
  try {
    const response = await axios.post(
      "http://localhost:5000/requirement/register",
      {
        requirementName: requirementName,
        description: description,
      }
    );

    if (response?.status === 200) {
      return response;
    } else {
      return null;
    }
  } catch (e) {
    console.error("API Error:", e);
  }
}
