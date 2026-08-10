
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function MyComplaints({ onBack }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/my-complaints/",
        {
          withCredentials: true,
        }
      );

      setComplaints(response.data);
    } catch (error) {
      console.error("COMPLAINT FETCH ERROR:", error);

      if (error.response?.status === 401) {
        alert("Please login first.");
      } else {
        alert("Unable to load your complaints.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-complaints-container">

      <button className="back-button" onClick={onBack}>
        ← Back to ComplaintAI
      </button>

      <div className="my-complaints-heading">
        {/* <div className="login-logo">📋</div> */}

        <h1>My Complaints</h1>

        <p>
          View and track all the complaints you have submitted.
        </p>
      </div>

      {loading ? (
        <div className="empty-complaints">
          <h3>Loading your complaints...</h3>
        </div>
      ) : complaints.length === 0 ? (
        <div className="empty-complaints">
          <div>📭</div>
          <h3>No Complaints Yet</h3>
          <p>
            You haven't submitted any complaints yet.
          </p>
        </div>
      ) : (
        <div className="complaints-list">

          {complaints.map((complaint) => (
            <div
              className="complaint-history-card"
              key={complaint.id}
            >

              <div className="complaint-card-header">

                <div>
                  <span className="complaint-number">
                    Complaint #{complaint.id}
                  </span>

                  <h3>{complaint.department}</h3>
                </div>

                <span
                  className={`status-badge ${
                    complaint.status
                      ?.toLowerCase()
                      .replace(" ", "-")
                  }`}
                >
                  {complaint.status}
                </span>

              </div>

              <div className="complaint-details">

                <div>
                  <span>📍 Location</span>
                  <strong>{complaint.location}</strong>
                </div>

                <div>
                  <span>🌐 Language</span>
                  <strong>{complaint.language}</strong>
                </div>

                <div>
                  <span>🔥 Priority</span>
                  <strong>{complaint.priority}</strong>
                </div>

                <div>
                  <span>📅 Submitted</span>
                  <strong>
                    {new Date(
                      complaint.created_at
                    ).toLocaleDateString()}
                  </strong>
                </div>

              </div>

              <div className="complaint-description">

                <span>Your Complaint</span>

                <p>
                  {complaint.complaint_text}
                </p>

              </div>

              <div className="complaint-translation">

                <span>AI Translation</span>

                <p>
                  {complaint.translation}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyComplaints;

