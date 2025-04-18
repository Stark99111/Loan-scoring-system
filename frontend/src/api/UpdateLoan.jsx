import axios from "axios";

export default async function UpdateLoan(
  id,
  name,
  categoryNums,
  bankCategoryNums,
  reqDescriptions,
  status,
  conDescriptions, // Ensure this is an array or expected structure
  description
) {
  try {
    // Check if conDescriptions is a boolean value or something unexpected
    if (
      typeof conDescriptions !== "object" ||
      !Array.isArray(conDescriptions)
    ) {
      console.warn("conDescriptions should be an array or object.");
      return { error: "Invalid format for conDescriptions" };
    }

    // Proceed with the API request
    const response = await axios.put(
      `http://localhost:5000/loan/update/${id}/${status}`,
      {
        name,
        categoryNums,
        bankCategoryNums,
        reqDescriptions,
        conDescriptions,
        description,
      }
    );

    if (response.status === 200) {
      // You can return the response data here if you need it in the calling code
      return response.data;
    } else {
      // Handle non-200 status codes if necessary
      return { error: "Unexpected response status" };
    }
  } catch (e) {
    // Log the error and return a user-friendly message or rethrow it
    console.error("API Error:", e);
    return { error: "An error occurred while updating the loan." };
  }
}
