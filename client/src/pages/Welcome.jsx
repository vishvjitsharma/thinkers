import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import UserStore from "../stores/UserStore";

const Welcome = () => {
  const { loginState } = UserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (loginState) {
      navigate("/app");
    }
  }, [loginState, navigate]);

  return (
    <main className="showcase">
      <div className="container">
        <h1 className="heading">
        Unleashing the Power of Collective{" "}
          <span className="highlight-text">Thoughts</span>
        </h1>
        <Link to="/app">
          <button className="btn">Get Inspired</button>
        </Link>
      </div>
    </main>
  );
};

export default Welcome;
