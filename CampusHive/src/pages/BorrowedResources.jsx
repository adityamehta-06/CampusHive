import { useEffect, useState } from "react";
import { API_URL, getToken } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function BorrowedResources() {
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [message, setMessage] = useState("");

  // load my requests
  useEffect(() => {
    if (!getToken()) {
      return;
    }
    fetch(API_URL + "/borrow-requests/mine", {
      headers: { "Authorization": "Bearer " + getToken() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
        } else {
          setBorrowedItems(data);
        }
      })
      .catch(() => setMessage("Cannot connect to the server. Is the backend running?"));
  }, []);

  // mark as returned
  const handleReturn = (id) => {
    fetch(API_URL + "/borrow-requests/" + id + "/status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken(),
      },
      body: JSON.stringify({ status: "Returned" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
        } else {
          setBorrowedItems(borrowedItems.map((item) => (item._id === data._id ? data : item)));
        }
      })
      .catch(() => setMessage("Cannot connect to the server. Is the backend running?"));
  };

  return (
    <div>
      <Navbar />

      <main className="page">
        <h1 className="page-title">My Borrowed Items</h1>
        <p className="page-subtitle">Items you have requested or borrowed.</p>

        {!getToken() && <p className="message">Please log in to see your borrowed items.</p>}
        {message && <p className="message">{message}</p>}
        {getToken() && borrowedItems.length === 0 && <p>You have not borrowed anything yet.</p>}

        <div className="card-list">
          {borrowedItems.map((item) => (
            <div className="box" key={item._id}>
              <h3>{item.resourceName}</h3>
              <p>Owner: {item.ownerName}</p>
              <p>Requested on: {new Date(item.createdAt).toLocaleDateString()}</p>
              <p>Return by: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "-"}</p>
              <p>
                Status: <span className={"status-" + item.status.toLowerCase()}>{item.status}</span>
              </p>

              {item.status === "Approved" && (
                <div className="actions">
                  <button className="btn" onClick={() => handleReturn(item._id)}>Mark as Returned</button>
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

export default BorrowedResources;
