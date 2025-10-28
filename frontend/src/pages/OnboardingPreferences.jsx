import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Onboarding.css";

function OnboardingPreferences() {
  const navigate = useNavigate();
  const [groupPreference, setGroupPreference] = useState("");
  const [loading, setLoading] = useState(false);

  const preferences = [
    { id: "small", label: "Small Groups", description: "4-6 people" },
    { id: "medium", label: "Medium Groups", description: "7-12 people" },
    { id: "large", label: "Large Groups", description: "13+ people" },
    { id: "any", label: "No Preference", description: "Any size works" },
  ];

  const handleComplete = async () => {
    if (!groupPreference) return;

    setLoading(true);

    // Get data from sessionStorage
    const name = sessionStorage.getItem("tempUserName");
    const authId = sessionStorage.getItem("tempUserId");
    const challenges = JSON.parse(
      sessionStorage.getItem("onboarding_challenges")
    );
    const location = sessionStorage.getItem("onboarding_location");

    // Create user profile in database
    const { error } = await supabase.from("users").insert({
      auth_id: authId,
      name: name,
      location: location,
      challenges: challenges,
      group_preference: groupPreference,
    });

    if (error) {
      console.error("Error creating profile:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // Clean up temp data
    sessionStorage.removeItem("tempUserName");
    sessionStorage.removeItem("tempUserId");
    sessionStorage.removeItem("onboarding_challenges");
    sessionStorage.removeItem("onboarding_location");

    setLoading(false);

    // Go to mood check-in
    navigate("/mood-checkin");
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "100%" }}></div>
          </div>
          <p className="progress-text">Step 3 of 3</p>
        </div>

        <div className="onboarding-content">
          <h1 className="onboarding-title">What's your comfort zone?</h1>
          <p className="onboarding-subtitle">
            Choose your preferred group size for activities
          </p>

          <div className="preference-grid">
            {preferences.map((pref) => (
              <button
                key={pref.id}
                onClick={() => setGroupPreference(pref.id)}
                className={`preference-card ${
                  groupPreference === pref.id ? "selected" : ""
                }`}
              >
                <span className="preference-label">{pref.label}</span>
                <span className="preference-description">
                  {pref.description}
                </span>
                {groupPreference === pref.id && (
                  <span className="preference-check">✓</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleComplete}
            disabled={!groupPreference || loading}
            className="onboarding-button"
          >
            {loading ? "Setting up your profile..." : "Complete Setup"}
          </button>

          <button
            onClick={() => navigate("/onboarding/location")}
            className="onboarding-back"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPreferences;
