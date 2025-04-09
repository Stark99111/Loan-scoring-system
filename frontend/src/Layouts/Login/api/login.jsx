import axios from "axios";

export default async function Login(domain, password) {
  try {
    if (domain && password) {
      const response = await axios.post(
        "http://localhost:5000/employee/login",
        {
          domain,
          password,
        }
      );

      if (response?.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role[0].RoleNum);

        return response;
      } else {
        return null;
      }
    }
  } catch (e) {
    console.error("API Error:", e);
  }
}
