import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageCircleMore,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { validateForm } from "../utils/validateForm";
import signupImage from "../assets/signup.png";
import PasswordBar from "../Components/PasswordBar";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  // Navigate hook
  const navigate = useNavigate();

  // Form Ref
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (fullNameRef.current) {
      fullNameRef.current.focus();
    }
  }, []);

  // Get signup api call and isSingingUp state from zustand store
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm("register", formData);

    if (isValid === true) {
      const isSuccess = await signup(formData);

      if (isSuccess) {
        setFormData({ fullname: "", email: "", password: "" });
        navigate('/')
      }
    }
  };

  return (
    <section className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-5 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageCircleMore className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          {/* Name input element */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={`input input-bordered w-full pl-10 focus:border-none rounded-md`}
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
                  className={`input input-bordered w-full pl-10 focus:border-none rounded-md`}
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
                  className={`input input-bordered w-full pl-10 focus:border-none rounded-md`}
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
              className="btn btn-primary w-full rounded-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-primary-focus"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <div className="hidden lg:flex flex-col justify-center bg-base-300 p-12">
        <img
          src={signupImage}
          alt="Sign up illustration"
          className="max-w-full mb-8 max-h-screen object-cover mix-blend-screen rounded-lg hover:rounded-2xl transition-all duration-300 border border-base-100 hover:mix-blend-exclusion hover:shadow-lg hover:shadow-base-100"
        />

        <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
        <p className="text-base-content/60">
          Connect with friends, share moments, and stay in touch with your loved
          ones.
        </p>
      </div>
    </section>
  );
};
export default SignUpPage;
