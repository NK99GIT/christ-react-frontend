// src/components/EditModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";

export default function EditModal({ initialData, onClose, onSave }) {
  const [form, setForm] = useState({
    username: initialData.username,
    email: initialData.email,
    password: "",
  });
  const [err, setErr] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (form.password && form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) return setErr(errors);

    const updated = {
      ...initialData,
      username: form.username.trim(),
      email: form.email.trim(),
      ...(form.password ? { password: form.password } : {}),
    };
    onSave(updated);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-11/12 max-w-md p-6 rounded-sm shadow space-y-4"
      >
        <h2 className="text-xl font-bold text-primary mb-2">Edit Profile</h2>

        {/* username */}
        <div>
          <label className="text-sm font-medium">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          />
          {err.username && <p className="text-error text-xs">{err.username}</p>}
        </div>

        {/* email */}
        <div>
          <label className="text-sm font-medium">E-mail</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          />
          {err.email && <p className="text-error text-xs">{err.email}</p>}
        </div>

        {/* password */}
        <div>
          <label className="text-sm font-medium">New Password (optional)</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Leave blank to keep current password"
          />
          {err.password && <p className="text-error text-xs">{err.password}</p>}
        </div>

        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-primary text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
