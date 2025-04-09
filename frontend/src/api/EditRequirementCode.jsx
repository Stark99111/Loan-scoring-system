import axios from "axios";

export default async function EditRequirementCode(id, code) {
  try {
    console.log(id);
    if (id && code) {
      const response = await axios.post(
        "http://localhost:5000/requirement/addRequirementCode",
        {
          id: id,
          code: code,
        }
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
