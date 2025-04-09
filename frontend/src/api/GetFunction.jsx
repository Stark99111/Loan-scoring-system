import axios from "axios";

export default async function GetFunction(cusId, num) {
  console.log(cusId);
  try {
    const response = await axios.get(
      `http://localhost:5000/loan/customers/calculate/${cusId}/${num}`
    );

    if (response?.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (e) {
    console.error("API Error:", e);
  }
}
