import React, { useState } from "react";
import { Link } from 'react-router-dom';  // Import Link for navigation
import "../styles.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImage from "../images/hero.jpg";
import reduceIcon from "../images/reduce-icon.svg";
import reuseIcon from "../images/reuse-icon.svg";
import recycleIcon from "../images/recycle-icon.svg";
import reduceImage from "../images/reduce.jpg";
import reuseImage from "../images/reuse.png";
import recycleImage from "../images/recycle.jpg";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("reduce");

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <img src={heroImage} alt="Hero Banner" className="hero-image" />
        <div className="hero-text">
          <h1>Welcome to Yakadabadu.lk</h1>
          <p>Reduce Waste. Reuse Materials. Recycle Responsibly.</p>
          <button className="get-started-btn">Get Started</button>
        </div>
      </section>

      {/* Reduce, Reuse, Recycle Section */}
      <section className="rrr-section">
        <h2>Leading the Way in Sustainable Scrap Collection and Recycling</h2>
        <div className="rrr-slider">
          <div className="rrr-slider-item">
            <p>Reduce</p>
            <div
              className={`rrr-circle ${activeTab === "reduce" ? "active" : ""}`}
              onClick={() => setActiveTab("reduce")}
            >
              <img src={reduceIcon} alt="Reduce" />
            </div>
          </div>

          <div className="rrr-slider-item">
            <p>Reuse</p>
            <div
              className={`rrr-circle ${activeTab === "reuse" ? "active" : ""}`}
              onClick={() => setActiveTab("reuse")}
            >
              <img src={reuseIcon} alt="Reuse" />
            </div>
          </div>

          <div className="rrr-slider-item">
            <p>Recycle</p>
            <div
              className={`rrr-circle ${activeTab === "recycle" ? "active" : ""}`}
              onClick={() => setActiveTab("recycle")}
            >
              <img src={recycleIcon} alt="Recycle" />
            </div>
          </div>
          <div className="services-text">
            <h3>Our Services</h3>
            <p>We offer a range of services to help you manage waste sustainably, from pickup scheduling to waste recycling partnerships.</p>
          </div>
        </div>

        {/* Description Section */}
        <div className="rrr-content">
          {activeTab === "reduce" && (
            <div className="rrr-info morph">
              <img src={reduceImage} alt="Reduce" className="rrr-image" />
              <div className="rrr-text">
                <h3>Reduce</h3>
                <p>We make it easy to responsibly dispose of your waste with our pickup scheduling and drop-off services for metal and plastic waste. By reducing unnecessary waste buildup, we help keep the environment clean while ensuring materials are directed to the right channels for further use. Choose to give away your waste and be part of the sustainability movement!</p>
                <Link to="/schedulepickup">
                  <button className="learn-more-btn">Schedule Pickup</button>
                </Link>
              </div>
            </div>
          )}
          {activeTab === "reuse" && (
            <div className="rrr-info morph">
              <img src={reuseImage} alt="Reuse" className="rrr-image" />
              <div className="rrr-text">
                <h3>Reuse</h3>
                <p>Not everything is waste! We focus on reselling usable materials and repurposing valuable parts that can be modified and given a second life. Instead of letting materials go to waste, we ensure they are carefully assessed, repaired, and resold, reducing the demand for new production and minimizing environmental impact. Browse through our collection of reusable items and discover quality materials at affordable prices.
                </p>
                <button className="learn-more-btn">Explore</button>
              </div>
            </div>
          )}
          {activeTab === "recycle" && (
            <div className="rrr-info morph">
              <img src={recycleImage} alt="Recycle" className="rrr-image" />
              <div className="rrr-text">
                <h3>Recycle</h3>
                <p>While we don’t recycle directly, we partner with specialized recycling companies to ensure that your waste is processed responsibly. Metal, plastic, and other recyclable materials are collected and sent to trusted facilities that transform them into new, usable products. By bridging the gap between waste collection and recycling, we contribute to a cleaner and greener future!</p>
                <button className="learn-more-btn">Learn More</button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
