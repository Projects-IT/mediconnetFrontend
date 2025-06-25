import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import img from '../Header/m-c.png';

const Footer = () => {
  const hours = [
    { id: 1, day: "Monday", time: "9:00 AM - 6:00 PM" },
    { id: 2, day: "Tuesday", time: "9:00 AM - 6:00 PM" },
    { id: 3, day: "Wednesday", time: "9:00 AM - 6:00 PM" },
    { id: 4, day: "Thursday", time: "9:00 AM - 6:00 PM" },
    { id: 5, day: "Friday", time: "9:00 AM - 6:00 PM" },
    { id: 6, day: "Saturday", time: "9:00 AM - 3:00 PM" },
    { id: 7, day: "Sunday", time: "Closed" },
  ];

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-content">
          <div className="footer-section about">
            <div className="footer-logo-container">
              <img src={img} alt="MediConnect Logo" className="footer-logo"/>
              <h3>MediConnect</h3>
            </div>
            <p>MediConnect is dedicated to providing the best healthcare services. Our platform connects you with experienced professionals and simplifies your medical journey.</p>
            <div className="social-links">
              <a href="#" className="social-link"><FaFacebookF /></a>
              <a href="#" className="social-link"><FaTwitter /></a>
              <a href="#" className="social-link"><FaInstagram /></a>
              <a href="#" className="social-link"><FaLinkedinIn /></a>
            </div>
          </div>
          
          <div className="footer-section links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/appointment">Book Appointment</Link></li>
              <li><Link to="/consultants">Our Specialists</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-section hours">
            <h4>Opening Hours</h4>
            <ul>
              {hours.map((element) => (
                <li key={element.id}>
                  <span>{element.day}</span>
                  <span>{element.time}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-section contact">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <FaPhone className="footer-icon" />
                <span>(123) 456-7890</span>
              </li>
              <li>
                <FaEnvelope className="footer-icon" />
                <span>contact@mediconnect.com</span>
              </li>
              <li>
                <FaMapMarkerAlt className="footer-icon" />
                <span>123 Health Street, Medical Center, 12345</span>
              </li>
              <li>
                <FaClock className="footer-icon" />
                <span>Mon-Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} MediConnect. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
