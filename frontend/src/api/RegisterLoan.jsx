import axios from "axios";

export default async function RegisterLoan(
  name,
  categoryNums,
  bankCategoryNums,
  reqDescriptions,
  conDescriptions,
  image,
  description
) {
  try {
    const response = await axios.post("http://localhost:5000/loan/register", {
      name,
      categoryNums,
      bankCategoryNums,
      reqDescriptions,
      conDescriptions,
      image,
      description,
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
