import React from 'react';
import { FaHeartbeat, FaUserMd, FaHospital, FaEye, FaBullseye, FaUsers, FaAward, FaHandHoldingMedical, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
    const stats = [
        { icon: <FaUserMd />, count: "50+", label: "Specialist Doctors" },
        { icon: <FaHandHoldingMedical />, count: "10,000+", label: "Patients Served" },
        { icon: <FaAward />, count: "15+", label: "Years of Excellence" },
    ];

    return (
        <section className="about-page">
            <div className="about-hero">
                <div className="about-hero-overlay"></div>
                <div className="about-hero-content">
                    <h1 className="animate-fade-in">About MediConnect</h1>
                    <p className="animate-fade-in-delay">Revolutionizing healthcare through technology and compassion</p>
                </div>
            </div>

            <div className="container">
                <div className="story-section">
                    <div className="story-image animate-slide-right">
                        <img src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80" alt="Medical Team" />
                    </div>
                    <div className="story-content animate-slide-left">
                        <h2>Our Story</h2>
                        <p>
                            Founded in 2008, MediConnect began with a simple yet powerful vision: to bridge the gap between patients and healthcare providers through innovative technology. What started as a small team of dedicated healthcare professionals and tech enthusiasts has grown into a comprehensive platform serving thousands of patients nationwide.
                        </p>
                        <p>
                            Our journey has been driven by a deep understanding of the challenges faced by both patients and healthcare providers in today's complex medical landscape. By leveraging cutting-edge technology and maintaining a human-centered approach, we've created a seamless ecosystem that prioritizes patient care while optimizing clinical workflows.
                        </p>
                    </div>
                </div>

                <div className="stats-section">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card animate-scale">
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-count">{stat.count}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="mission-vision-section">
                    <div className="info-card animate-slide-up">
                        <FaBullseye className="card-icon" />
                        <h3>Our Mission</h3>
                        <p>
                            To transform healthcare delivery through technology that connects patients with the right care at the right time. We strive to make quality healthcare accessible, efficient, and personalized for everyone, regardless of location or circumstance.
                        </p>
                    </div>
                    <div className="info-card animate-slide-up-delay">
                        <FaEye className="card-icon" />
                        <h3>Our Vision</h3>
                        <p>
                            To create a world where healthcare is seamlessly integrated into daily life, where preventive care is prioritized, and where technology empowers both patients and providers to achieve optimal health outcomes.
                        </p>
                    </div>
                </div>

                <div className="values-section">
                    <h2>Our Core Values</h2>
                    <div className="values-grid">
                        <div className="value-item animate-fade-in">
                            <div className="value-icon">
                                <FaHeartbeat />
                            </div>
                            <h4>Patient-Centered Care</h4>
                            <p>We place patients at the center of everything we do, ensuring their needs, preferences, and well-being guide our decisions.</p>
                        </div>
                        <div className="value-item animate-fade-in-delay">
                            <div className="value-icon">
                                <FaChartLine />
                            </div>
                            <h4>Innovation</h4>
                            <p>We continuously explore new technologies and approaches to improve healthcare delivery and patient outcomes.</p>
                        </div>
                        <div className="value-item animate-fade-in-delay-2">
                            <div className="value-icon">
                                <FaHospital />
                            </div>
                            <h4>Excellence</h4>
                            <p>We maintain the highest standards of quality and professionalism in all aspects of our service.</p>
                        </div>
                    </div>
                </div>

                <div className="team-cta-section">
                    <div className="team-cta-content animate-slide-up">
                        <FaUsers className="team-icon" />
                        <h2>Meet Our Healthcare Professionals</h2>
                        <p>Our team of experienced and dedicated specialists is committed to providing exceptional care tailored to your unique needs.</p>
                        <Link to="/consultants" className="btn-primary">
                            Meet Our Specialists
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
