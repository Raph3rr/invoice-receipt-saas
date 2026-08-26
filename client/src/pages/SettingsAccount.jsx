import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";

const SettingsAccount = () => {
  const { user, setUser } = useAuth();

  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setSavingProfile(true);
    try {
      const { data } = await api.put("/auth/me", profileForm);
      if (setUser) setUser(data.user);
      setProfileSuccess("Profile updated");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setSavingPassword(true);
    try {
      await api.put("/auth/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess("Password updated");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Could not update password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="p-6 max-w-lg">
      <Link to="/settings" className="text-sm text-brand hover:underline">← Back to Settings</Link>
      <h1 className="text-xl font-semibold mt-3 mb-6">Account</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Profile</h2>

        {profileError && (
          <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-danger text-sm px-3 py-2">{profileError}</div>
        )}
        {profileSuccess && (
          <div className="mb-3 rounded-md bg-green-50 border border-green-200 text-success text-sm px-3 py-2">{profileSuccess}</div>
        )}

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-3">
          <Input
            label="Name"
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            required
          />
          <Input
            label="Phone"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400"
            />
            <p className="text-xs text-gray-400">Email can't be changed here.</p>
          </div>
          <Button type="submit" disabled={savingProfile} className="mt-1 self-start">
            {savingProfile ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Change Password</h2>

        {passwordError && (
          <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-danger text-sm px-3 py-2">{passwordError}</div>
        )}
        {passwordSuccess && (
          <div className="mb-3 rounded-md bg-green-50 border border-green-200 text-success text-sm px-3 py-2">{passwordSuccess}</div>
        )}

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
          <Input
            label="Current password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            required
          />
          <Input
            label="New password"
            type="password"
            minLength={6}
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            required
          />
          <Input
            label="Confirm new password"
            type="password"
            minLength={6}
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            required
          />
          <Button type="submit" disabled={savingPassword} className="mt-1 self-start">
            {savingPassword ? "Updating..." : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SettingsAccount;
