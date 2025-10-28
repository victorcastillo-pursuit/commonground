import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./MoodCheckIn.css";

function MoodCheckIn() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(false);

  const moods = [
    { value: 1, label: "Struggling", description: "Really tough today" },
    { value: 2, label: "Difficult", description: "Not my best" },
    { value: 3, label: "Okay", description: "Getting through" },
    { value: 4, label: "Good", description: "Feeling steady" },
    { value: 5, label: "Great", description: "Feeling strong" },
  ];

  const handleMoodSelect = (value) => {
    setSelectedMood(value);
  };

  const handleSubmit = async () => {
    if (selectedMood === null) return;

    setLoading(true);

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in first");
      navigate("/login");
      return;
    }

    // Get user's profile (for location and challenges)
    const { data: userProfile } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .single();

    if (!userProfile) {
      alert("Profile not found");
      setLoading(false);
      return;
    }

    // Save mood to database
    const { error } = await supabase.from("moods").insert({
      user_id: userProfile.id,
      mood: selectedMood,
      location: userProfile.location,
      challenge: userProfile.challenges[0],
      is_mock_data: false,
    });

    if (error) {
      console.error("Error saving mood:", error);
      alert("Failed to save mood. Please try again.");
      setLoading(false);
      return;
    }

    console.log("Mood saved successfully, navigating to dashboard...");
    setLoading(false);

    // Go to dashboard
    navigate("/dashboard");
    console.log("Navigate called");
  };

  return (
    <div className="mood-checkin">
      <div className="mood-checkin__container">
        <div className="mood-checkin__content">
          <h1 className="mood-checkin__title">
            How are you feeling right now?
          </h1>

          <div className="mood-checkin__scale">
            {moods.map((mood) => (
              <button
                key={mood.value}
                className={`mood-button mood-button--${mood.value} ${
                  selectedMood === mood.value ? "mood-button--selected" : ""
                }`}
                onClick={() => handleMoodSelect(mood.value)}
                aria-label={`Mood level ${mood.value}: ${mood.label}`}
              >
                <div className="mood-button__circle">
                  <div className="mood-button__inner"></div>
                </div>
                <div className="mood-button__label">{mood.label}</div>
                <div className="mood-button__description">
                  {mood.description}
                </div>
              </button>
            ))}
          </div>

          <button
            className={`mood-checkin__submit ${
              selectedMood !== null ? "mood-checkin__submit--active" : ""
            }`}
            onClick={handleSubmit}
            disabled={selectedMood === null || loading}
          >
            {loading ? "Saving..." : "Submit Check-In"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoodCheckIn;
