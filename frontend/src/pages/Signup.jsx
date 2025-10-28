import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // FIXED: Create user row in users table
    const { error: userError } = await supabase.from("users").insert({
      id: authData.user.id,
      name: formData.name,
      email: formData.email, // Save email for reminders
      location: "", // Will be filled during onboarding
      challenges: [], // Will be filled during onboarding
      group_preference: "", // Will be filled during onboarding
    });

    if (userError) {
      console.error("Error creating user:", userError);
      setError("Failed to create user profile. Please try again.");
      setLoading(false);
      return;
    }

    // Store name temporarily for onboarding
    sessionStorage.setItem("tempUserName", formData.name);
    sessionStorage.setItem("tempUserId", authData.user.id);

    setLoading(false);

    // Go to onboarding
    navigate("/onboarding/challenges");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-brand">CommonGround</h1>
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Join a community that understands</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              minLength="6"
              required
            />
            <p className="form-hint">At least 6 characters</p>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating account..." : "Continue"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="auth-link">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
