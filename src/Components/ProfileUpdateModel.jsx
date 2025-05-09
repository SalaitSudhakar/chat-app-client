import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../Store/useAuthStore";
import { isUpdateProfileFormValid } from "../utils/validateForm";
import PasswordBar from "../Components/PasswordBar";
import Modal from "../Components/Modal";
import { User, Mail, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";

const ProfileUpdateModel = ({ isModalOpen, closeModal, setIsModalOpen }) => {
  const { checkAuth, userData, isUpdatingProfileData, updateProfileData } =
    useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: userData.fullname || "",
    email: userData.email || "",
    password: "",
  });

  // Form Ref
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Update Profile Data
  const handleUpdateProfileData = async (e) => {
    e.preventDefault();

    if (
      formData?.fullname === userData?.fullname &&
      formData?.email === userData?.email &&
      !formData?.password
    ) {
      toast.error(
        "No changes detected. Please modify your profile information before updating."
      );

      return;
    }

    const isValid = isUpdateProfileFormValid(formData);

    if (isValid === true) {
      const isSuccess = await updateProfileData(formData);

      if (isSuccess) {
        setFormData({ password: "" });
        checkAuth();
        setIsModalOpen(false);
      }
    }
  };

  useEffect(() => {
    if (fullNameRef.current) {
      fullNameRef.current.focus();
    }
  }, []);

  return (
    <>
      <Modal
        title={"Update Profile"}
        closeModal={closeModal}
        isModalOpen={isModalOpen}
      >
        {/* Update profile */}
        {/* Name input element */}
        <form onSubmit={handleUpdateProfileData} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <User className="size-5 text-base-content/40" />
              </div>
              <input
                type="text"
                ref={fullNameRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    emailRef.current?.focus();
                  }
                }}
                className={`input input-bordered text-base-content  w-full pl-10 focus:border-none rounded-md`}
                placeholder="John Doe"
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
              />
            </div>
          </div>
          {/* Email input element */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Mail className="size-5 text-base-content/40" />
              </div>
              <input
                type="email"
                ref={emailRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    passwordRef.current?.focus();
                  }
                }}
                className={`input input-bordered text-base-content w-full pl-10 focus:border-none rounded-md`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password input element */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                ref={passwordRef}
                className={`input input-bordered text-base-content w-full pl-10 focus:border-none rounded-md`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {/* Show password button */}
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40 " />
                ) : (
                  <Eye className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          {/* Password Strength Bar */}
          <PasswordBar formData={formData} />

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full rounded-lg transform transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-lg hover:bg-primary-focus"
            disabled={isUpdatingProfileData}
          >
            {isUpdatingProfileData ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default ProfileUpdateModel;
