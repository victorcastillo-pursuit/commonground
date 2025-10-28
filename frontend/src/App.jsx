import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OnboardingChallenges from "./pages/OnboardingChallenges";
import OnboardingLocation from "./pages/OnboardingLocation";
import OnboardingPreferences from "./pages/OnboardingPreferences";
import MoodCheckIn from "./components/MoodCheckIn";
import CommunityDashboard from "./components/CommunityDashboard";
import ActivitiesList from "./pages/ActivitiesList";
import ActivityDetails from "./pages/ActivityDetails";
import MyActivities from "./pages/MyActivities";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/onboarding/challenges"
          element={<OnboardingChallenges />}
        />
        <Route path="/onboarding/location" element={<OnboardingLocation />} />
        <Route
          path="/onboarding/preferences"
          element={<OnboardingPreferences />}
        />
        <Route
          path="/mood-checkin"
          element={<MoodCheckIn onComplete={() => {}} />}
        />
        <Route path="/dashboard" element={<CommunityDashboard />} />
        <Route path="/activities" element={<ActivitiesList />} />
        <Route path="/activity/:id" element={<ActivityDetails />} />
        <Route path="/my-activities" element={<MyActivities />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
