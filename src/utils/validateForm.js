import toast from 'react-hot-toast';

export const validateForm = (formData) => {
    // Check if all required fields are provided
    if (!formData.fullname.trim()) {
      return toast.error("Full name is required");
    }

    // Validate fullname: Only letters and spaces allowed
    if (!/^[A-Za-z0-9\s]+$/.test(formData.fullname.trim())) {
      return toast.error("Full name can only contain letters and spaces");
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error("Invalid email format");
    }

    // Validate password
    if (!formData.password) {
      return toast.error("Password is required");
    }

    // Password must be at least 6 characters long
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    // Validate password strength: Must contain 1 lowercase, 1 uppercase, 1 number, and 1 symbol
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

    if (!passwordPattern.test(formData.password)) {
      return toast.error(
        "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol"
      );
    }

    return true;
  };
