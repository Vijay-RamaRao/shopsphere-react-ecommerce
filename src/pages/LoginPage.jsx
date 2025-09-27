import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    {" "}
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.122C34.553 5.166 29.693 3 24 3C12.43 3 3 12.43 3 24s9.43 21 21 21s21-9.43 21-21c0-1.341-.138-2.65-.389-3.917z"
    ></path>{" "}
    <path
      fill="#FF3D00"
      d="M6.306 14.691c-1.324 2.493-2.095 5.37-2.095 8.309c0 2.939.771 5.816 2.095 8.309L12.02 24l-5.714-9.309z"
    ></path>{" "}
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238c-2.008 1.32-4.402 2.108-7.219 2.108c-5.22 0-9.643-3.336-11.284-7.932l-6.305 4.902C7.925 39.366 15.245 44 24 44z"
    ></path>{" "}
    <path
      fill="#1976D2"
      d="M43.611 20.083L43.594 20H24v8h11.303a12.024 12.024 0 0 1-5.22 7.932l6.305 4.902C41.075 35.866 44 30.166 44 24c0-1.341-.138-2.65-.389-3.917z"
    ></path>{" "}
  </svg>
);

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      toast.error("Failed to log in.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Failed to sign in with Google.");
    }
    setLoading(false);
  };

  const handlePasswordReset = async () => {
    if (!email) {
      return toast.error(
        "Please enter your email address to reset your password."
      );
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (err) {
      toast.error("Failed to send password reset email.");
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg-light w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Login to Your Account
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleEmailLogin} className="space-y-5">
          {/* Email and Password inputs */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-sm text-primary-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
        <div className="text-center my-4 text-gray-500">OR</div>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-200"
        >
          <GoogleIcon /> Sign In with Google
        </button>
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
