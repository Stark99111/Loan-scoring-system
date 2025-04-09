import axios from "axios";

export default async function GetCustomerInfo(ner, idNumber, phoneNumber) {
  try {
    const response = await axios.post(
      `http://localhost:5000/Customer/getCustomerByInfo`,
      {
        name: ner,
        idNumber: idNumber,
        phoneNumber: phoneNumber,
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
