import axios from "axios";

export default async function ChangeStatus(id, status) {
  try {
    const response = await axios.post(
      "http://localhost:5000/loan/changeStatus",
      {
        id: id,
        status: status,
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
