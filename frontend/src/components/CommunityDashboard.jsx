import "./CommunityDashboard.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function CommunityDashboard({ onBack }) {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="community-dashboard">
        <div className="community-dashboard__container">
          <div className="community-dashboard__content">
            <h1 className="community-dashboard__header">You're Not Alone</h1>

            <div className="community-dashboard__stats">
              <div className="stat-card">
                <div className="stat-card__icon">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="16" cy="16" r="8" fill="currentColor" />
                  </svg>
                </div>
                <div className="stat-card__content">
                  <div className="stat-card__number">38</div>
                  <div className="stat-card__label">
                    people in Queens checked in today
                  </div>
                </div>
              </div>

              <div className="stat-card stat-card--highlight">
                <div className="stat-card__icon">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 4L12 12H8L16 28L20 20H24L16 4Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="currentColor"
                      fillOpacity="0.2"
                    />
                  </svg>
                </div>
                <div className="stat-card__content">
                  <div className="stat-card__number">15</div>
                  <div className="stat-card__label">
                    people are managing anxiety right now
                  </div>
                </div>
              </div>
            </div>

            <div className="community-dashboard__footer">
              <div className="streak-indicator">
                <div className="streak-indicator__dots">
                  <span className="streak-dot streak-dot--filled"></span>
                  <span className="streak-dot streak-dot--filled"></span>
                  <span className="streak-dot streak-dot--filled"></span>
                  <span className="streak-dot"></span>
                  <span className="streak-dot"></span>
                  <span className="streak-dot"></span>
                  <span className="streak-dot"></span>
                </div>
                <p className="streak-indicator__text">
                  You've checked in <span>3 days</span> this week
                </p>
              </div>
            </div>
            <div className="dashboard-cta">
              <h2>Ready to Connect?</h2>
              <p>Find activities and meet people in your community</p>
              <button
                className="browse-activities-btn"
                onClick={() => navigate("/activities")}
              >
                Browse Activities
              </button>
            </div>

            {onBack && (
              <button className="community-dashboard__back" onClick={onBack}>
                Check In Again
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CommunityDashboard;
