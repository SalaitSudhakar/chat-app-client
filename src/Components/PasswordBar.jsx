import React from "react";
import {
  passwordStrengthScore,
  passwordStrengthBarColor,
  passwordStrengthText,
  passwordStrengthTextColor,
} from "../utils/passwordStrengthScore";

const PasswordBar = ({ formData }) => {
  // Calculate Password strength score
  const passwordScore = passwordStrengthScore(formData.password);
  const text = passwordStrengthText(passwordScore);
  const textColor = passwordStrengthTextColor(passwordScore);
  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex justify-between items-center text-[12px]">
        <span>Password Strength</span>
        <span className={`${textColor}`}>{text}</span>
      </div>

      <div className="flex items-center gap-1 w-full">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded ${passwordStrengthBarColor(
              passwordScore,
              i
            )}`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default PasswordBar;
