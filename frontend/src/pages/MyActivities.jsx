import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Plus, ArrowLeft } from "lucide-react";
import "./MyActivities.css";

function MyActivities() {
  const navigate = useNavigate();
  const [rsvpdActivities, setRsvpdActivities] = useState([]);
  const [createdActivities, setCreatedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    getCurrentUserAndFetchActivities();
  }, []);

  async function getCurrentUserAndFetchActivities() {
    setLoading(true);

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    setCurrentUserId(user.id);

    // Fetch activities user RSVP'd to
    const { data: participantData, error: participantError } = await supabase
      .from("activity_participants")
      .select(
        `
        activity_id,
        activities:activities(*)
      `
      )
      .eq("user_id", user.id);

    if (participantError) {
      console.error("Error fetching RSVP'd activities:", participantError);
    } else {
      // Extract activities from the nested structure
      const activities = participantData
        .map((p) => p.activities)
        .filter((a) => a !== null);
      setRsvpdActivities(activities);
    }

    // Fetch activities user created
    const { data: createdData, error: createdError } = await supabase
      .from("activities")
      .select("*")
      .eq("creator_id", user.id);

    if (createdError) {
      console.error("Error fetching created activities:", createdError);
    } else {
      setCreatedActivities(createdData);
    }

    setLoading(false);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
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

  function isUpcoming(dateString) {
    const activityDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return activityDate >= today;
  }

  if (loading) {
    return (
      <div className="my-activities-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-activities-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="my-activities-container">
        <div className="page-title-section">
          <h1 className="page-title">My Activities</h1>
          <p className="page-subtitle">
            Your upcoming events and activities you're hosting
          </p>
        </div>

        {/* RSVP'd Activities Section */}
        <div className="activities-section">
          <div className="section-header">
            <h2 className="section-title">Activities I'm Attending</h2>
            <span className="activity-count">
              {rsvpdActivities.filter((a) => isUpcoming(a.date)).length}
            </span>
          </div>

          {rsvpdActivities.filter((a) => isUpcoming(a.date)).length === 0 ? (
            <div className="empty-state">
              <Calendar size={48} className="empty-icon" />
              <p className="empty-text">No upcoming activities</p>
              <p className="empty-subtext">
                Browse activities and RSVP to join the community!
              </p>
              <button
                className="browse-button"
                onClick={() => navigate("/activities")}
              >
                Browse Activities
              </button>
            </div>
          ) : (
            <div className="activities-grid">
              {rsvpdActivities
                .filter((a) => isUpcoming(a.date))
                .map((activity) => (
                  <div
                    key={activity.id}
                    className="activity-card"
                    onClick={() => navigate(`/activity/${activity.id}`)}
                  >
                    <div className="activity-card-header">
                      <span className="activity-type-tag">
                        {activity.activity_type}
                      </span>
                    </div>
                    <h3 className="activity-card-title">{activity.title}</h3>
                    <div className="activity-card-details">
                      <div className="activity-detail">
                        <Calendar size={16} />
                        <span>{formatDate(activity.date)}</span>
                      </div>
                      <div className="activity-detail">
                        <Clock size={16} />
                        <span>{formatTime(activity.time)}</span>
                      </div>
                      <div className="activity-detail">
                        <MapPin size={16} />
                        <span>{activity.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Created Activities Section */}
        <div className="activities-section">
          <div className="section-header">
            <h2 className="section-title">Activities I'm Hosting</h2>
            <span className="activity-count">
              {createdActivities.filter((a) => isUpcoming(a.date)).length}
            </span>
          </div>

          {createdActivities.filter((a) => isUpcoming(a.date)).length === 0 ? (
            <div className="empty-state">
              <Plus size={48} className="empty-icon" />
              <p className="empty-text">No activities hosted yet</p>
              <p className="empty-subtext">
                Create an activity and bring the community together!
              </p>
              <button
                className="create-button"
                onClick={() => navigate("/dashboard")}
              >
                Create Activity
              </button>
            </div>
          ) : (
            <div className="activities-grid">
              {createdActivities
                .filter((a) => isUpcoming(a.date))
                .map((activity) => (
                  <div
                    key={activity.id}
                    className="activity-card hosted"
                    onClick={() => navigate(`/activity/${activity.id}`)}
                  >
                    <div className="activity-card-header">
                      <span className="activity-type-tag">
                        {activity.activity_type}
                      </span>
                      <span className="host-badge">Host</span>
                    </div>
                    <h3 className="activity-card-title">{activity.title}</h3>
                    <div className="activity-card-details">
                      <div className="activity-detail">
                        <Calendar size={16} />
                        <span>{formatDate(activity.date)}</span>
                      </div>
                      <div className="activity-detail">
                        <Clock size={16} />
                        <span>{formatTime(activity.time)}</span>
                      </div>
                      <div className="activity-detail">
                        <MapPin size={16} />
                        <span>{activity.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyActivities;
