import axios from "axios";

export default async function Login(domain, password, isAdmin) {
  try {
    if (!domain || !password) return null;

    let url = isAdmin
      ? "http://localhost:5000/employee/login"
      : "http://localhost:5000/customer/login";

    const payload = isAdmin
      ? { domain, password }
      : { phoneNumber: domain, password };

    const response = await axios.post(url, payload);

    if (response?.status === 200) {
      const { token, user, userId } = response.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("user", user);
      localStorage.setItem("userId", userId);

      return 200;
    } else {
      return null;
    }
  } catch (e) {
    console.error("API Error:", e);
    return null;
  }
}
