import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

function OnboardingChallenges() {
  const navigate = useNavigate();
  const [selectedChallenges, setSelectedChallenges] = useState([]);

  const challenges = [
    { id: "anxiety", label: "Anxiety" },
    { id: "depression", label: "Depression" },
    { id: "loneliness", label: "Loneliness" },
    { id: "stress", label: "Stress / Burnout" },
  ];

  const toggleChallenge = (challengeId) => {
    if (selectedChallenges.includes(challengeId)) {
      setSelectedChallenges(
        selectedChallenges.filter((id) => id !== challengeId)
      );
    } else {
      setSelectedChallenges([...selectedChallenges, challengeId]);
    }
  };

  const handleContinue = () => {
    if (selectedChallenges.length === 0) return;

    sessionStorage.setItem(
      "onboarding_challenges",
      JSON.stringify(selectedChallenges)
    );
    navigate("/onboarding/location");
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "33%" }}></div>
          </div>
          <p className="progress-text">Step 1 of 3</p>
        </div>

        <div className="onboarding-content">
          <h1 className="onboarding-title">What brings you here?</h1>
          <p className="onboarding-subtitle">
            Select all that apply. You can always change this later.
          </p>

          <div className="challenge-grid">
            {challenges.map((challenge) => (
              <button
                key={challenge.id}
                onClick={() => toggleChallenge(challenge.id)}
                className={`challenge-card ${
                  selectedChallenges.includes(challenge.id) ? "selected" : ""
                }`}
              >
                <span className="challenge-label">{challenge.label}</span>
                {selectedChallenges.includes(challenge.id) && (
                  <span className="challenge-check">✓</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={selectedChallenges.length === 0}
            className="onboarding-button"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingChallenges;
