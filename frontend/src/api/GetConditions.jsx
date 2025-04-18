import axios from "axios";

export default async function GetCondition() {
  try {
    const response = await axios.get("http://localhost:5000/condition/");

    if (response?.status === 200) {
      return response;
    } else {
      return null;
    }
  } catch (e) {
    console.error("API Error:", e);
  }
}
