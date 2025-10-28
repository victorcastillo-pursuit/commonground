import { useNavigate } from "react-router-dom";
import NatureSlideshow from "../components/NatureSlideshow";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <NatureSlideshow />

      <div className="landing__content">
        <div className="landing__hero">
          <div className="landing__brand">CommonGround</div>
          <h1 className="landing__title">Find Your Common Ground</h1>
          <p className="landing__subtitle">
            Connect with people who understand what you're going through. Real
            support. Real meetups. Real community.
          </p>

          <div className="landing__buttons">
            <button
              className="landing__cta landing__cta--primary"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
            <button
              className="landing__cta landing__cta--secondary"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="landing__features">
          <div className="feature">
            <h3 className="feature__title">Find Your Tribe</h3>
            <p className="feature__description">
              Connect with others facing similar challenges in your area
            </p>
          </div>

          <div className="feature">
            <h3 className="feature__title">Real Meetups</h3>
            <p className="feature__description">
              Join local activities and build genuine friendships
            </p>
          </div>

          <div className="feature">
            <h3 className="feature__title">You're Not Alone</h3>
            <p className="feature__description">
              See how many people nearby are going through the same thing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
