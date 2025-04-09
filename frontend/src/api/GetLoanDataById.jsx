import axios from "axios";

export default async function GetLoanDataById(id) {
  try {
    console.log(id);
    const response = await axios.post("http://localhost:5000/loan/getById", {
      id: id,
    });

    if (response?.status === 200) {
      return response;
    } else {
      return null;
    }
  } catch (e) {
    console.error("API Error:", e);
  }
}
