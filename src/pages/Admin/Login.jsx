import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMail, HiEye, HiEyeOff } from "react-icons/hi";
import { MdLockOutline } from "react-icons/md";
import jeausImage from "../../assets/Images/admin-login.jpg";
import Logo from "../../assets/Images/logo-white.png";
import Axios from "../../services/Axios"; // ✅ your custom Axios instance

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [invalid, setInvalid] = useState("");
  const [showPwd, setShow] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Form validation
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setInvalid("");
      return;
    }

    try {
      const res = await Axios.post("/auth/login", form); // ✅ uses baseURL from Axios.js

      const { token, id } = res.data;

      // ✅ Store token for future requests

      localStorage.setItem("token", token);
      localStorage.setItem("email",  res.data.user.email);
      localStorage.setItem("avatar",  res.data.user.avatar);
      localStorage.setItem("name",  res.data.user.name);
      localStorage.setItem("id", id);
      // localStorage.setItem("user", JSON.stringify(user));

      // ✅ Redirect
      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response && error.response.data) {
        setInvalid(error.response.data.message);
      } else {
        setInvalid("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Illustration */}
      <div className="hidden md:block w-1/2 h-full">
        <img src={jeausImage} alt="Login illustration" className="w-full h-full object-cover" />
      </div>

      {/* Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-bg">
        <form
          onSubmit={handleLogin}
          className="w-11/12 max-w-md bg-white rounded-sm shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary to-purpleAccent py-2 px-6">
            <img src={Logo} className="w-[70px] mx-auto" alt="Logo" />
            <p className="text-white text-center text-md mt-1 font-bold">🎉 Welcome Admin 🎉 </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-textPrimary font-semibold">Email</label>
              <div className="flex items-center border rounded-sm px-3">
                <HiMail className="text-textSecondary text-lg mr-2" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full py-3 focus:outline-none"
                />
              </div>
              {errors.email && <p className="text-error text-sm">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-textPrimary font-semibold">Password</label>
              <div className="flex items-center border rounded-sm px-3">
                <MdLockOutline className="text-textSecondary text-lg mr-2" />
                <input
                  id="password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full py-3 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShow(!showPwd)}
                  className="focus:outline-none"
                >
                  {showPwd ? (
                    <HiEyeOff className="text-textSecondary text-lg" />
                  ) : (
                    <HiEye className="text-textSecondary text-lg" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-error text-sm">{errors.password}</p>}
            </div>

            {/* Error Message */}
            {invalid && <p className="text-error text-center text-sm">{invalid}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-sm font-semibold hover:bg-blue-600 transition"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
