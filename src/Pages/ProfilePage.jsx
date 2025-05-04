import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, User, Mail, Edit } from "lucide-react";
import avatar from "../assets/avatar.png";

import ProfileUpdateModel from "../Components/ProfileUpdateModel";

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userData, checkAuth, isUpdatingProfilePic, updateProfilePic } =
    useAuthStore();

  // Update Profile Pic
  const handleUpdateProfilePic = async (e) => {
    const file = e.target?.files[0];

    if (!file) return;

    console.log("file: ", file);
    setSelectedImg(file);

    const formData = new FormData();
    formData.append("profilePic", file);

    // Method 1: Using forEach
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    const success = await updateProfilePic(formData);

    if (success) {
      setSelectedImg(null);
      checkAuth();
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-1.5 sm:p-4 py-8 mt-24">
      <div className="bg-base-300 rounded-xl px-4 sm:px-6  py-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="my-2 text-base-content/80">Your Profile Details</p>
        </div>

        {/* Avatar upload section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={
                (selectedImg && URL.createObjectURL(selectedImg)) ||
                userData.profilePic ||
                avatar
              }
              alt="Profile Picture"
              className="border-2 rounded-full size-32 border-base-content"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 cursor-pointer p-2 rounded-full transition-all duration-300 ${
                isUpdatingProfilePic ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                onChange={handleUpdateProfilePic}
                disabled={isUpdatingProfilePic}
                className="file-input hidden"
              />
            </label>
          </div>
          <div className="text-xs sm:text-sm text-gray-400">
            <p>
              {isUpdatingProfilePic
                ? "Uploading..."
                : "Click the camera icon to update the profile pic"}
            </p>
          </div>
        </div>

        {/* Profile details */}
        {/* fullname */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
              {userData?.fullname}
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
              {userData?.email}
            </p>
          </div>

          {/* Edit Link */}
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="btn btn-primary w-full mb-4 rounded-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-primary-focus"
          >
            <Edit className="size-5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Open Model to update Profile Data */}
      {isModalOpen && (
        <ProfileUpdateModel closeModal={() => setIsModalOpen(false)} />
      )}
    </section>
  );
};

export default ProfilePage;
