import axios from "axios";

export default async function RegisterCondition(conditionName, Description) {
  try {
    console.log(conditionName);
    const response = await axios.post(
      "http://localhost:5000/condition/register",
      {
        conditionName: conditionName,
        Description: Description,
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
