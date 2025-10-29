import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./ActivitiesList.css";

function ActivitiesList() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    setLoading(true);

    const { data, error } = await supabase
      .from("activities")
      .select(
        `
        *,
        creator:users!creator_id(name),
        participants:activity_participants(count)
      `
      )
      //.gte("date", new Date().toISOString().split("T")[0]) // this is to show only activities for the future
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) {
      console.error("Error fetching activities:", error);
    } else {
      setActivities(data);
      if (error) {
        console.error("Error fetching activities:", error);
      } else {
        console.log("Activities from database:", data); // ADD THIS LINE
        setActivities(data);
      }
    }

    setLoading(false);
  }

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  function getParticipantCount(activity) {
    return activity.participants?.[0]?.count || 0;
  }

  function getSpotsLeft(activity) {
    const participantCount = getParticipantCount(activity);
    return activity.max_participants - participantCount;
  }

  const filteredActivities =
    filter === "all"
      ? activities
      : activities.filter((a) => a.activity_type === filter);

  const activityTypes = [...new Set(activities.map((a) => a.activity_type))];

  if (loading) {
    return (
      <div className="activities-page">
        <div className="loading">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="activities-page">
      <div className="activities-header">
        <h1>Discover Activities</h1>
        <p>Connect with your community through shared experiences</p>
        <button
          className="create-activity-btn"
          onClick={() => navigate("/create-activity")}
        >
          Create Activity
        </button>
      </div>

      <div className="activities-filters">
        <button
          className={filter === "all" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("all")}
        >
          All Activities
        </button>
        {activityTypes.map((type) => (
          <button
            key={type}
            className={filter === type ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="activities-grid">
        {filteredActivities.length === 0 ? (
          <div className="no-activities">
            <p>No activities found</p>
            <button onClick={() => navigate("/create-activity")}>
              Be the first to create one
            </button>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="activity-card"
              onClick={() => navigate(`/activity/${activity.id}`)}
            >
              <div className="activity-card-header">
                <span className="activity-type">{activity.activity_type}</span>
                <span className="activity-spots">
                  {getSpotsLeft(activity)} spots left
                </span>
              </div>

              <h3 className="activity-title">{activity.title}</h3>

              <div className="activity-details">
                <div className="activity-detail">
                  <span className="detail-icon">📅</span>
                  <span>{formatDate(activity.date)}</span>
                </div>
                <div className="activity-detail">
                  <span className="detail-icon">🕐</span>
                  <span>{formatTime(activity.time)}</span>
                </div>
                <div className="activity-detail">
                  <span className="detail-icon">📍</span>
                  <span>{activity.location}</span>
                </div>
              </div>

              <div className="activity-footer">
                <span className="activity-host">
                  Hosted by {activity.creator?.name}
                </span>
                <span className="activity-participants">
                  {getParticipantCount(activity)} joined
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ActivitiesList;
