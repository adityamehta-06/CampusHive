import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL, SERVER_URL } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./resources.css";

function Resources() {
  const [resources, setResources] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // load resources
  useEffect(() => {
    fetch(API_URL + "/resources")
      .then((res) => res.json())
      .then((data) => setResources(data))
      .catch(() => setMessage("Cannot connect to the server. Start the backend to see resources."));
  }, []);

  // search + filters
  const search = searchTerm.toLowerCase();
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(search) ||
      resource.category.toLowerCase().includes(search) ||
      resource.owner.toLowerCase().includes(search);
    const matchesAvailability = availabilityFilter === "" || resource.available === availabilityFilter;
    const matchesCondition = conditionFilter === "" || resource.condition === conditionFilter;
    const matchesCategory = categoryFilter === "" || resource.category === categoryFilter;

    return matchesSearch && matchesAvailability && matchesCondition && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setAvailabilityFilter("");
    setConditionFilter("");
    setCategoryFilter("");
  };

  return (
    <div>
      <Navbar />

      <main className="page">
        <h1 className="page-title">Find Campus Resources</h1>
        <p className="page-subtitle">Borrow what you need. Share what you have.</p>

        <div className="box filters">
          <input
            type="search"
            placeholder="Search by name, category or owner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="filter-row">
            <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
              <option value="">All availability</option>
              <option value="Available">Available</option>
              <option value="Borrowed">Borrowed</option>
            </select>

            <select value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)}>
              <option value="">All conditions</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>

            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All categories</option>
              <option value="Books">Books</option>
              <option value="Calculators">Calculators</option>
              <option value="Electronics">Electronics</option>
              <option value="Lab Equipment">Lab Equipment</option>
              <option value="Notes">Notes</option>
              <option value="Sports Equipment">Sports Equipment</option>
              <option value="Other">Other</option>
            </select>

            <button type="button" className="btn" onClick={clearFilters}>Clear</button>
          </div>
        </div>

        <div className="card-list">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="box">
              {resource.imageUrl && <img src={SERVER_URL + resource.imageUrl} alt={resource.name} className="resource-img" />}
              <h3>{resource.name}</h3>
              <p>Category: {resource.category}</p>
              <p>Condition: {resource.condition}</p>
              <p>Owner: {resource.owner}</p>
              <p>
                Status: <span className={"status-" + resource.available.toLowerCase()}>{resource.available}</span>
              </p>
              <Link to={"/resources/" + resource.id} className="btn">View Details</Link>
            </div>
          ))}
        </div>

        {message && <p className="message">{message}</p>}
        {!message && filteredResources.length === 0 && <p>No resources found.</p>}
      </main>

      <Footer />
    </div>
  );
}

export default Resources;
