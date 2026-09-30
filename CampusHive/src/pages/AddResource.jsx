import { useState } from "react";
import { API_URL, getToken } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./AddResource.css";

function AddResource() {
  const [resourceName, setResourceName] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!getToken()) {
      setMessage("Please log in before listing a resource.");
      return;
    }

    const form = event.target;

    // FormData for photo upload
    const formData = new FormData();
    formData.append("name", resourceName);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    fetch(API_URL + "/resources", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + getToken(),
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
        } else {
          setMessage("Resource listed successfully.");
          setResourceName("");
          setCategory("");
          setCondition("");
          setDescription("");
          setImageFile(null);
          form.reset();
        }
      })
      .catch(() => setMessage("Cannot connect to the server. Is the backend running?"));
  };

  return (
    <div>
      <Navbar />

      <main className="page">
        <div className="box form-box">
          <h1 className="page-title">List a Resource</h1>
          <p className="page-subtitle">Fill the details of the item you want to share.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="resourceName">Resource Name</label>
            <input
              id="resourceName"
              type="text"
              value={resourceName}
              onChange={(e) => setResourceName(e.target.value)}
              required
            />

            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select category</option>
              <option value="Books">Books</option>
              <option value="Calculators">Calculators</option>
              <option value="Electronics">Electronics</option>
              <option value="Lab Equipment">Lab Equipment</option>
              <option value="Notes">Notes</option>
              <option value="Sports Equipment">Sports Equipment</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="condition">Condition</label>
            <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} required>
              <option value="">Select condition</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <label htmlFor="image">Photo (optional, JPG or PNG, max 2 MB)</label>
            <input
              id="image"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            <button type="submit" className="btn">List Resource</button>
          </form>

          {message && <p className="message">{message}</p>}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AddResource;
