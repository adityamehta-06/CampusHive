import { useEffect, useState } from "react";
import { API_URL, getToken } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function BorrowRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  // load received requests
  useEffect(() => {
    if (!getToken()) {
      return;
    }
    fetch(API_URL + "/borrow-requests/received", {
      headers: { "Authorization": "Bearer " + getToken() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
        } else {
          setRequests(data);
        }
      })
      .catch(() => setMessage("Cannot connect to the server. Is the backend running?"));
  }, []);

  // approve / reject
  const handleAction = (id, newStatus) => {
    fetch(API_URL + "/borrow-requests/" + id + "/status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken(),
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
        } else {
          setRequests(requests.map((req) => (req._id === data._id ? data : req)));
        }
      })
      .catch(() => setMessage("Cannot connect to the server. Is the backend running?"));
  };

  return (
    <div>
      <Navbar />

      <main className="page">
        <h1 className="page-title">Borrow Requests</h1>
        <p className="page-subtitle">Requests sent by students for your resources.</p>

        {!getToken() && <p className="message">Please log in to see your requests.</p>}
        {message && <p className="message">{message}</p>}
        {getToken() && requests.length === 0 && <p>No requests yet.</p>}

        <div className="card-list">
          {requests.map((req) => (
            <div className="box" key={req._id}>
              <h3>{req.resourceName}</h3>
              <p>Requested by: {req.requesterName}</p>
              <p>Date: {new Date(req.createdAt).toLocaleDateString()}</p>
              <p>Duration: {req.durationDays} days</p>
              <p>
                Status: <span className={"status-" + req.status.toLowerCase()}>{req.status}</span>
              </p>

              {req.status === "Pending" && (
                <div className="actions">
                  <button className="btn btn-green" onClick={() => handleAction(req._id, "Approved")}>Approve</button>
                  <button className="btn btn-red" onClick={() => handleAction(req._id, "Rejected")}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BorrowRequests;
