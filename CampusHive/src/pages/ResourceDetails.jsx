import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL, SERVER_URL, getToken, getUser } from "../services/api";
import "./ResourceDetails.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ResourceDetails() {
  // id from URL
  const { id } = useParams();

  const [resource, setResource] = useState(null);
  const [message, setMessage] = useState("");
  const [durationDays, setDurationDays] = useState(7);
  const user = getUser();

  // load resource
  useEffect(() => {
    fetch(API_URL + "/resources/" + id)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
        } else {
          setResource(data);
        }
      })
      .catch(() => setMessage("Cannot connect to the server. Is the backend running?"));
  }, [id]);

  // send borrow request
  const requestBorrow = () => {
    if (!user) {
      setMessage("Please log in before requesting a resource.");
      return;
    }

    fetch(API_URL + "/borrow-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken(),
      },
      body: JSON.stringify({
        resourceId: resource.id,
        durationDays: durationDays,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
        } else {
          setMessage("Borrow request sent for " + durationDays + " days.");
        }
      })
      .catch(() => setMessage("Cannot connect to the server. Is the backend running?"));
  };

  if (!resource) {
    return (
      <div>
        <Navbar />
        <p className="page">{message || "Loading..."}</p>
      </div>
    );
  }

  const isOwner = user && user.id === resource.ownerId;

  return (
    <div>
      <Navbar />

      <main className="page">
        <Link to="/resources">Back to Resources</Link>

        <div className="box details">
          {resource.imageUrl && <img src={SERVER_URL + resource.imageUrl} alt={resource.name} className="details-img" />}

          <h1>{resource.name}</h1>
          <p><b>Category:</b> {resource.category}</p>
          <p><b>Condition:</b> {resource.condition}</p>
          <p><b>Owner:</b> {resource.owner}</p>
          <p>
            <b>Status:</b> <span className={"status-" + resource.available.toLowerCase()}>{resource.available}</span>
          </p>
          {resource.description && <p><b>Description:</b> {resource.description}</p>}

          <hr />

          {isOwner && <p>This is your listing.</p>}

          {!isOwner && resource.available === "Available" && (
            <div>
              <label htmlFor="duration">Borrow for</label>
              <select id="duration" value={durationDays} onChange={(e) => setDurationDays(e.target.value)}>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
              <button className="btn" onClick={requestBorrow}>Request to Borrow</button>
            </div>
          )}

          {!isOwner && resource.available !== "Available" && <p>This item is currently borrowed.</p>}

          {message && <p className="message">{message}</p>}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ResourceDetails;
