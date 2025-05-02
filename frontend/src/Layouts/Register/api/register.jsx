import axios from "axios";

export default async function RegisterAPI(phone, password, idNumber) {
  try {
    if (!phone || !password || !idNumber) return null;

    let url = "http://localhost:5000/customer/register";

    const payload = { phone, password, idNumber };

    const response = await axios.post(url, payload);

    if (response?.status === 200) {
      const { token, user, userId } = response.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("user", user);
      localStorage.setItem("userId", userId);

      return 200;
    } else if (response.status === 400) {
      return response.data?.message;
    } else {
      return response.data?.message;
    }
  } catch (e) {
    console.error("API Error:", e);
    if (e.response) {
      // Server responded with a status code outside 2xx
      return (
        e.response.data?.message ||
        e.response.data?.error ||
        "Something went wrong"
      );
    }
    return "Network error";
  }
}
