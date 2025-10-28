import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Confetti from "../components/Confetti";
import "./ActivityDetails.css";

function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRsvped, setIsRsvped] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [rsvping, setRsvping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    getCurrentUser();
    fetchActivityDetails();
  }, [id]);

  async function getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
    }
  }

  async function fetchActivityDetails() {
    setLoading(true);

    const { data: activityData, error: activityError } = await supabase
      .from("activities")
      .select(
        `
        *,
        creator:users!creator_id(id, name)
      `
      )
      .eq("id", id)
      .single();

    if (activityError) {
      console.error("Error fetching activity:", activityError);
      setLoading(false);
      return;
    }

    setActivity(activityData);

    const { data: participantsData, error: participantsError } = await supabase
      .from("activity_participants")
      .select(
        `
        user_id,
        user:users(name)
      `
      )
      .eq("activity_id", id);

    if (participantsError) {
      console.error("Error fetching participants:", participantsError);
    } else {
      setParticipants(participantsData);

      if (currentUserId) {
        const userHasRsvped = participantsData.some(
          (p) => p.user_id === currentUserId
        );
        setIsRsvped(userHasRsvped);
      }
    }

    setLoading(false);
  }

  async function handleRsvp() {
    if (!currentUserId) {
      alert("Please log in to RSVP");
      navigate("/login");
      return;
    }

    if (participants.length >= activity.max_participants) {
      alert("This activity is full");
      return;
    }

    setRsvping(true);

    if (isRsvped) {
      const { error } = await supabase
        .from("activity_participants")
        .delete()
        .eq("activity_id", id)
        .eq("user_id", currentUserId);

      if (error) {
        console.error("Error canceling RSVP:", error);
        alert("Failed to cancel RSVP");
      } else {
        setIsRsvped(false);
        setShowCelebration(false);
        fetchActivityDetails();
      }
    } else {
      const { error } = await supabase.from("activity_participants").insert({
        activity_id: id,
        user_id: currentUserId,
      });

      if (error) {
        console.error("Error RSVPing:", error);
        alert("Failed to RSVP");
      } else {
        setIsRsvped(true);
        setShowConfetti(true);
        setShowCelebration(true);
        fetchActivityDetails();
      }
    }

    setRsvping(false);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  function getSpotsLeft() {
    return activity.max_participants - participants.length;
  }

  if (loading) {
    return (
      <div className="activity-details-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading activity...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="activity-details-page">
        <div className="error-container">
          <div className="error">Activity not found</div>
          <button
            className="back-button"
            onClick={() => navigate("/activities")}
          >
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-details-page">
      <Confetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/activities")}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {showCelebration && (
        <div className="celebration-banner">
          <div className="celebration-glow"></div>
          <div className="celebration-content">
            <Sparkles className="celebration-icon" size={32} />
            <h2>You're going!</h2>
            <p>We're so glad you're joining us. See you there!</p>
          </div>
        </div>
      )}

      <div className="activity-details-container">
        <div className="activity-details-header">
          <div className="header-background"></div>
          <div className="header-content">
            <span className="activity-type-badge">
              {activity.activity_type}
            </span>
            <h1 className="activity-title">{activity.title}</h1>
            <p className="activity-host">Hosted by {activity.creator?.name}</p>
          </div>
        </div>

        <div className="activity-details-content">
          <div className="activity-info-section">
            <h2>Details</h2>
            <div className="activity-info-grid">
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <Calendar className="info-icon" size={24} />
                </div>
                <div className="info-content">
                  <span className="info-label">Date</span>
                  <span className="info-value">
                    {formatDate(activity.date)}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrapper">
                  <Clock className="info-icon" size={24} />
                </div>
                <div className="info-content">
                  <span className="info-label">Time</span>
                  <span className="info-value">
                    {formatTime(activity.time)}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrapper">
                  <MapPin className="info-icon" size={24} />
                </div>
                <div className="info-content">
                  <span className="info-label">Location</span>
                  <span className="info-value">{activity.location}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrapper">
                  <Users className="info-icon" size={24} />
                </div>
                <div className="info-content">
                  <span className="info-label">Spots</span>
                  <span className="info-value">
                    {participants.length} / {activity.max_participants} filled
                  </span>
                  <div className="spots-progress">
                    <div
                      className="spots-progress-bar"
                      style={{
                        width: `${
                          (participants.length / activity.max_participants) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {activity.description && (
            <div className="activity-description-section">
              <h2>About This Activity</h2>
              <p className="activity-description">{activity.description}</p>
            </div>
          )}

          <div className="activity-participants-section">
            <h2>Who's Going ({participants.length})</h2>
            {participants.length === 0 ? (
              <div className="no-participants">
                <Users size={48} className="no-participants-icon" />
                <p>Be the first to join!</p>
              </div>
            ) : (
              <div className="participants-list">
                {participants.map((participant, index) => (
                  <div
                    key={participant.user_id}
                    className="participant-item"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="participant-avatar">
                      {participant.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="participant-name">
                      {participant.user?.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="activity-rsvp-section">
          {getSpotsLeft() > 0 ? (
            <>
              <button
                className={isRsvped ? "rsvp-button rsvped" : "rsvp-button"}
                onClick={handleRsvp}
                disabled={rsvping}
              >
                {rsvping ? (
                  <span className="button-loading">
                    <span className="button-spinner"></span>
                    Processing...
                  </span>
                ) : isRsvped ? (
                  "Cancel RSVP"
                ) : (
                  "RSVP to Join"
                )}
              </button>
              <p className="spots-left-text">
                <span className="spots-left-count">{getSpotsLeft()}</span>{" "}
                {getSpotsLeft() === 1 ? "spot" : "spots"} remaining
              </p>
            </>
          ) : (
            <div className="activity-full">
              <p>This activity is full</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityDetails;
