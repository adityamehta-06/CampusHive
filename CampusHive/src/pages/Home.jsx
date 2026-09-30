import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {
  return (
    <div>
      <Navbar />

      <div className="banner">
        <h1>Share. Borrow. Save.</h1>
        <p>Borrow books, calculators, lab kits and more from students on your campus.</p>
        <Link to="/resources" className="btn">Find a Resource</Link>
        <Link to="/add-resource" className="btn">List a Resource</Link>
      </div>

      <main className="page">
        <h2>How CampusHive Works</h2>
        <div className="steps">
          <div className="box">
            <h3>1. Discover</h3>
            <p>Find resources you need from other students.</p>
          </div>
          <div className="box">
            <h3>2. Request</h3>
            <p>Send a request to the resource owner.</p>
          </div>
          <div className="box">
            <h3>3. Borrow</h3>
            <p>Get approved and borrow the resource.</p>
          </div>
          <div className="box">
            <h3>4. Return</h3>
            <p>Return the resource within the agreed period.</p>
          </div>
        </div>

        <h2>What Can You Share?</h2>
        <p>Books, Calculators, Laptops, Lab Kits, Notes and Sports Equipment.</p>

        <h2>Why CampusHive?</h2>
        <div className="card-list">
          <div className="box">
            <h3>Reduce Purchases</h3>
            <p>Students don't need to buy items they will only use a few times.</p>
          </div>
          <div className="box">
            <h3>Save Money</h3>
            <p>Borrowing helps lower the cost of expensive course materials.</p>
          </div>
          <div className="box">
            <h3>Encourage Sharing</h3>
            <p>Make your unused items useful to someone else.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
