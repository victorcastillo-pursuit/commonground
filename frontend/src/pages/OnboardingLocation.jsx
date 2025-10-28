import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

function OnboardingLocation() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");

  const handleContinue = () => {
    if (!location.trim()) return;

    sessionStorage.setItem("onboarding_location", location);
    navigate("/onboarding/preferences");
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "66%" }}></div>
          </div>
          <p className="progress-text">Step 2 of 3</p>
        </div>

        <div className="onboarding-content">
          <h1 className="onboarding-title">Where are you located?</h1>
          <p className="onboarding-subtitle">
            This helps us connect you with people nearby
          </p>

          <div className="location-input-wrapper">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or neighborhood (e.g., Brooklyn, Queens)"
              className="location-input"
              autoFocus
            />
          </div>

          <button
            onClick={handleContinue}
            disabled={!location.trim()}
            className="onboarding-button"
          >
            Continue
          </button>

          <button
            onClick={() => navigate("/onboarding/challenges")}
            className="onboarding-back"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingLocation;
