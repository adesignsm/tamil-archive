import React from 'react';
import "./assets/loading.css";

const LoadingScreen = () => {
  return (
    <div id="loading-screen">
      <div className="loader"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingScreen;