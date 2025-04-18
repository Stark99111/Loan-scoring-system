import axios from "axios";

export default async function DeleteLoan(id) {
  try {
    if (id) {
      const response = await axios.delete(
        `http://localhost:5000/loan/delete/${id}`
      );

      if (response?.status === 200) {
        return response;
      } else {
        return null;
      }
    }
  } catch (e) {
    console.error("API Error:", e);
  }
}
