import React, { useState, useEffect, useContext } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaHospital, FaUserMd, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Contact.css';
import { ApiUrlContext } from '../../App';

const Contact = () => {
    const apiUrl = useContext(ApiUrlContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086432398186!2d144.9537353153169!3d-37.8172099797518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1620837238739!5m2!1sen!2sus");

    useEffect(() => {
        // Try to get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                    
                    // Update map URL to show nearby hospitals
                    const newMapUrl = `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=hospitals+near+${latitude},${longitude}&zoom=14`;
                    setMapUrl(newMapUrl);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    toast.info("Using default location. Enable location services to see hospitals near you.");
                }
            );
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${apiUrl}/patient-api/messages`, formData);
            if (response.data.message === "Message sent successfully") {
                toast.success('Message sent successfully!');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            }
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="contact-page">
            <div className="contact-hero">
                <div className="contact-hero-overlay"></div>
                <div className="contact-hero-content">
                    <h1>Get in Touch</h1>
                    <p>We're here to help you with any questions or concerns</p>
                </div>
            </div>

            <div className="container">
                <div className="contact-content">
                    <div className="contact-form-container">
                        <div className="contact-form-header">
                            <FaUserMd className="contact-icon pulse" />
                            <h2>Send Us a Message</h2>
                            <p>Fill out the form below and we'll get back to you as soon as possible</p>
                        </div>
                        
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Your Name</label>
                                <input
                                    type="text"
                                        id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                        placeholder="John Doe"
                                />
                            </div>
                                <div className="form-group">
                                    <label htmlFor="email">Your Email</label>
                                <input
                                    type="email"
                                        id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                        placeholder="johndoe@example.com"
                                />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Your Message</label>
                                <textarea
                                    id="message"
                                    rows="6"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Please provide details about your inquiry..."
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    <div className="contact-info-container">
                        <h2>Contact Information</h2>
                        <p>Feel free to reach out to us through any of the following methods. Our dedicated team is available to assist you from Monday to Friday, 9 AM to 5 PM.</p>
                        
                        <div className="contact-cards">
                            <div className="contact-card">
                                <div className="card-icon">
                                    <FaMapMarkerAlt />
                                </div>
                                <div className="card-content">
                                    <h3>Visit Us</h3>
                                    <p>123 Health Street, Wellness City, 45678</p>
                                </div>
                            </div>
                            
                            <div className="contact-card">
                                <div className="card-icon">
                                    <FaPhone />
                                </div>
                                <div className="card-content">
                                    <h3>Call Us</h3>
                                    <p>(123) 456-7890</p>
                                </div>
                            </div>
                            
                            <div className="contact-card">
                                <div className="card-icon">
                                    <FaEnvelope />
                                </div>
                                <div className="card-content">
                                    <h3>Email Us</h3>
                                    <p>contact@mediconnect.com</p>
                                </div>
                            </div>
                            
                            <div className="contact-card">
                                <div className="card-icon">
                                    <FaClock />
                                </div>
                                <div className="card-content">
                                    <h3>Working Hours</h3>
                                    <p>Monday - Friday: 9 AM - 5 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="map-container">
                            <div className="map-header">
                                <FaHospital className="map-icon" />
                                <h3>{userLocation ? 'Hospitals Near You' : 'Our Location'}</h3>
                            </div>
                            <iframe
                                src={mapUrl}
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Google Maps Location"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <p className="map-note">
                                {userLocation ? 
                                    'Showing hospitals near your current location.' : 
                                    'Enable location services to see hospitals near you.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
