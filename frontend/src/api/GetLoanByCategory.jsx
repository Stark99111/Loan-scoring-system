import axios from "axios";

export default async function GetLoanByCategory(CategoryCode) {
  try {
    const response = await axios.get(
      `http://localhost:5000/loan/getByCategory/${CategoryCode}`
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
