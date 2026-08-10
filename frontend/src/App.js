import "./App.css";
import { useState } from "react";
import axios from "axios";
import Login from "./Login";
import Signup from "./Signup";
import MyComplaints from "./MyComplaints";
import AdminDashboard from "./AdminDashboard";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    complaint: "",
  });

  const [result, setResult] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showMyComplaints, setShowMyComplaints] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.location ||
      !formData.complaint 
    ) {
      alert("Please fill all the required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/analyze/",
        {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          complaint: formData.complaint,
        },
        {
          withCredentials: true,
        }
      );

      setResult(response.data);
      console.log(response.data);

      alert("Complaint Submitted Successfully!");

      setFormData({
        name: "",
        phone: "",
        location: "",
        complaint: "",
      });
    } catch (error) {
      console.error(error);
      alert("Submission Failed");
    }
  };
if (showAdminDashboard) {
  return (
    <AdminDashboard
      onBack={() => setShowAdminDashboard(false)}
    />
  );
}
  if (showLogin) {
  return (
    <Login
      onBack={() => setShowLogin(false)}
      onSignup={() => {
        setShowLogin(false);
        setShowSignup(true);
      }}
      onLoginSuccess={(user) => {
    setIsLoggedIn(true);
    setLoggedInUser(user);
    setShowLogin(false);
  }}
    />
  );
}

  if (showSignup) {
  return (
    <Signup
      onBack={() => setShowSignup(false)}
      onLogin={() => {
  setShowSignup(false);
  setShowLogin(true);
}}
    />
  );
}
if (showMyComplaints) {
  return (
    <MyComplaints
      onBack={() => setShowMyComplaints(false)}
      isLoggedIn={isLoggedIn}
      loggedInUser={loggedInUser} 
    />
  );
}
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">🌍</span>
          <span>ComplaintAI</span>
        </div>

        <div className="nav-links">
  <a href="#home">Home</a>
  <a href="#complaint">Submit Complaint</a>

  <button
    className="nav-link-button"
    onClick={() => setShowMyComplaints(true)} >
    My Complaints
  </button>

  <a href="#about">About</a>
  <a href="#contact">Contact</a>
  <button
    className="nav-link-button"
    onClick={() => setShowAdminDashboard(true)}
  >
    Admin Dashboard
  </button>
</div>

      {/* <button
        className="nav-login"
        onClick={() => setShowLogin(true)}
      >
        Login
      </button>   */}
      {isLoggedIn ? (
  <>
    <span className="welcome-user">
      👋 Welcome, {loggedInUser?.name}
    </span>

    <button
      className="nav-login"
      onClick={() => {
        setIsLoggedIn(false);
        setLoggedInUser(null);
      }}
    >
      Logout
    </button>
  </>
) : (
  <button
    className="nav-login"
    onClick={() => setShowLogin(true)}
  >
    Login
  </button>
)}
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-badge">
            AI-Powered Civic Support
          </div>

          <h1>
            Speak Your Language.
            <span> We’ll Route Your Complaint.</span>
          </h1>

          <p>
            Submit your complaint in your preferred language and let AI
            understand, translate, categorize, and route it to the
            appropriate department.
          </p>

          <a href="#complaint" className="hero-button">
            Submit a Complaint →
          </a>
        </div>

        <div className="hero-card">
          <div className="floating-icon">🤖</div>

          <h3>Smart Complaint Routing</h3>

          <div className="mini-result">
            <span></span>
            <div>
              <small>Language</small>
              <strong>Local Language</strong>
            </div>
          </div>

          <div className="mini-result">
            <span></span>
            <div>
              <small>AI Analysis</small>
              <strong>Understanding Complaint</strong>
            </div>
          </div>

          <div className="mini-result">
            <span></span>
            <div>
              <small>Routing</small>
              <strong>Correct Department</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Complaint Section */}
      <section className="complaint-section" id="complaint">

        <div className="section-heading">
          <span></span>
          <p>REPORT AN ISSUE</p>
          <h2>Submit Your Complaint</h2>
          <div className="heading-line"></div>
          <span className="heading-description">
            Tell us what's happening. Our AI will take care of the rest.
          </span>
        </div>

        <div className="complaint-layout">

          {/* Form Card */}
          <div className="form-card">

            <div className="card-top">
              <div>
                <h3>Complaint Details</h3>
                <p>Please provide accurate information.</p>
              </div>

              <div className="form-icon"></div>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="input-group">
                <label>Full Name</label>

                <div className="input-wrapper">
                  <span>👤</span>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    pattern="[A-Za-z ]+"
                    title="Name should contain only letters"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Phone Number</label>

                <div className="input-wrapper">
                  <span>📞</span>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    title="Enter a valid 10-digit phone number"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Location</label>

                <div className="input-wrapper">
                  <span>📍</span>

                  <input
                    type="text"
                    name="location"
                    placeholder="Enter your location"
                    value={formData.location}
                    onChange={handleChange}
                    pattern="[A-Za-z ]+"
                    title="Location should contain only letters"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Complaint</label>

                <div className="textarea-wrapper">
                  <span>📝</span>

                  <textarea
                    name="complaint"
                    placeholder="Describe your complaint in detail..."
                    rows="6"
                    value={formData.complaint}
                    onChange={handleChange}
                    minLength="10"
                    title="Complaint should contain at least 10 characters"
                    required
                  />
                </div>

                <small className="input-help">
                  You can write your complaint in your preferred language.
                </small>
              </div>

              <button type="submit" className="submit-button">
                <span></span>
                Analyze & Submit Complaint
                <span>→</span>
              </button>

            </form>
          </div>

          {/* Information Card */}
          <div className="info-card">

            <div className="info-icon"></div>

            <h3>How AI Helps</h3>

            <p>
              Your complaint is analyzed automatically and routed to
              the appropriate department.
            </p>

            <div className="process-step">
              <span>01</span>
              <div>
                <strong>Detect Language</strong>
                <p>AI identifies the language of your complaint.</p>
              </div>
            </div>

            <div className="process-step">
              <span>02</span>
              <div>
                <strong>Understand & Translate</strong>
                <p>Your complaint is translated into English.</p>
              </div>
            </div>

            <div className="process-step">
              <span>03</span>
              <div>
                <strong>Identify Department</strong>
                <p>AI determines where the complaint belongs.</p>
              </div>
            </div>

            <div className="process-step">
              <span>04</span>
              <div>
                <strong>Set Priority</strong>
                <p>Urgency is classified automatically.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* AI Result */}
      {result && (
        <section className="result-section">

          <div className="section-heading">
            <div className="ai-result-icon">🤖</div>

            <p>AI PROCESSING COMPLETE</p>

            <h2>Complaint Analysis</h2>

            <div className="heading-line"></div>
          </div>

          <div className="result-card">

            <div className="result-header">
              <div>
                <h3>AI Analysis Result</h3>
                <p>Your complaint has been successfully analyzed.</p>
              </div>

              <span className="success-badge">
                ✓ Analyzed
              </span>
            </div>

            <div className="result-grid">

              <div className="result-item">
                <div className="result-icon language-icon">🌐</div>

                <div>
                  <span>Detected Language</span>
                  <strong>
                    {result.language || "Not detected"}
                  </strong>
                </div>
              </div>

              <div className="result-item">
                <div className="result-icon department-icon">🏢</div>

                <div>
                  <span>Assigned Department</span>
                  <strong>
                    {result.department || "Not assigned"}
                  </strong>
                </div>
              </div>

              <div className="result-item translation-item">
                <div className="result-icon">📝</div>

                <div>
                  <span>English Translation</span>
                  <strong>
                    {result.translation || "Not available"}
                  </strong>
                </div>
              </div>

              <div className="result-item">
                <div className="result-icon priority-icon">🔥</div>

                <div>
                  <span>Priority Level</span>

                  <strong
                    className={`priority ${
                      result.priority?.toLowerCase() || ""
                    }`}
                  >
                    {result.priority || "Not assigned"}
                  </strong>
                </div>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* About */}
      <section className="about-section" id="about">

        <div className="about-content">

          <div className="section-heading">
            <p>OUR IDEA</p>
            <h2>Why ComplaintAI?</h2>
            <div className="heading-line"></div>
          </div>

          <p>
            ComplaintAI was created to make civic complaint reporting
            easier and more accessible for everyone. People may face
            difficulties when reporting public issues because of
            language barriers and uncertainty about which department
            should handle their complaint.
          </p>

          <p>
            This project uses artificial intelligence to understand
            complaints written in different local languages, translate
            them into English, identify the relevant department, and
            determine the urgency of the issue.
          </p>

        </div>

      </section>

      {/* Contact */}
      <section className="contact-section" id="contact">

        <div className="section-heading">
          <p>GET IN TOUCH</p>
          <h2>Contact</h2>
          <div className="heading-line"></div>
        </div>

        <div className="contact-card">

          <h3>Have a question?</h3>

          <p>
            Feel free to reach out regarding the project,
            collaboration, or development.
          </p>

          <div className="contact-links">
  <a
    href="mailto:sandhyakanthraj24@gmail.com"
    className="contact-link"
  >
    Email |
  </a>

<a
href="https://www.linkedin.com/in/sandhya-ak"
target="_blank"
rel="noreferrer"
className="contact-link"

>
LinkedIn |

  </a>

<a
href="https://github.com/SandhyaAK24"
target="_blank"
rel="noreferrer"
className="contact-link"

>

GitHub |

  </a>
</div>

        </div>

      </section>

      {/* Footer */}
      <footer>
        <div className="logo">
          🌍 ComplaintAI
        </div>

        <p>
          AI-powered complaint routing for a more accessible civic experience.
        </p>

        <small>
          © 2026 ComplaintAI. Built with React, Django & AI.
        </small>
      </footer>

    </div>
  );
}

export default App;