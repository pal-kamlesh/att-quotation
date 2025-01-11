import { useLocation } from "react-router-dom";

const LandingPage = () => {
  const location = useLocation();
  const { name } = location.state || { name: "User" };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome, {name}!</h1>
      <img
        src="https://via.placeholder.com/150"
        alt="Welcome"
        className="rounded-full shadow-lg"
      />
    </div>
  );
};

export default LandingPage;
