import { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { Shimmer } from "react-shimmer";
import UserServices from "../../services/User.services";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", password: "", avatar: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");

  const adminId = localStorage.getItem("id");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!adminId) return;
        const res = await UserServices.getProfileById(adminId);
        const data = res.data;
        setAdmin(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          avatar: data.avatar || "",
          password: "",
        });
      } catch (err) {
        console.error("Error fetching admin profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setForm((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(file), // For preview only
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      await UserServices.updateProfile({
        name: form.name,
        phone: form.phone,
        id: adminId,
      });
      setMessage("Profile updated successfully");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (!form.password) return;
    try {
      await UserServices.changePassword({ id: adminId, password: form.password });
      setForm((prev) => ({ ...prev, password: "" }));
      setMessage("Password updated");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update password");
    }
  };

  const handleUpdateAvatar = async () => {
    if (!avatarFile) {
      setMessage("Please select an image");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      formData.append("id", adminId);

      const res = await UserServices.uploadAvatar(formData);
      setForm((prev) => ({ ...prev, avatar: res.data.avatar }));
      setMessage("Avatar updated successfully");
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload avatar");
    }
  };

  if (loading) return <Shimmer width="100%" height={220} />;
  if (!admin) return <div className="p-10 text-error font-bold">Admin not found.</div>;

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Profile Card */}
       {message && <p className="text-sm text-center text-green-600">{message}</p>}
      <div className="bg-white rounded-2xl shadow p-6 flex gap-6">
        {form.avatar ? (
          <img
            src={`${form.avatar}`}
            alt={form.name}
            className="w-24 h-24 rounded-full border object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full border bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-primary">{form.name}</h2>
          <p className="flex items-center gap-2 text-textSecondary mt-1">
            <MdEmail /> {admin.email}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          onClick={handleUpdateProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>

        <hr />

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Change Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Change Password
        </button>

        <hr />

        {/* Avatar Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          onClick={handleUpdateAvatar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Avatar
        </button>
      </div>
    </div>
  );
}
