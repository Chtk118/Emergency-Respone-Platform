import React from "react";

function Home() {
  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">
        Emergency Response Coordination Platform
      </h1>
      <div className="text-center">
        <p className="lead">
          Report emergencies, track responders, and help save lives.
        </p>
        <a href="/report" className="btn btn-danger btn-lg mt-3">
          Report an Incident
        </a>
      </div>
    </div>
  );
}

export default Home;
