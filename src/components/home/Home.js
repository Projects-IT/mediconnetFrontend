import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaUserMd, FaCalendarAlt, FaHospital, FaHeartbeat, FaCommentMedical, FaMedal } from 'react-icons/fa';
import './Home.css';

// Import department images
import cardios from './departments/cardio.jpg';
import derma from './departments/derma.jpg';
import ent from './departments/ent.jpg';
import neuro from './departments/neuro.jpg';
import onco from './departments/onco.jpg';
import ortho from './departments/ortho.jpg';
import pedia from './departments/pedia.jpg';
import radio from './departments/radio.jpg';
import therapy from './departments/therapy.jpg';

function Home() {
  const departmentsArray = [
    { name: "Pediatrics", imageUrl: pedia, description: "Specialized care for infants, children, and adolescents" },
    { name: "Orthopedics", imageUrl: ortho, description: "Treatment for bones, joints, ligaments, tendons, and muscles" },
    { name: "Cardiology", imageUrl: cardios, description: "Expert care for heart and cardiovascular conditions" },
    { name: "Neurology", imageUrl: neuro, description: "Diagnosis and treatment of nervous system disorders" },
    { name: "Oncology", imageUrl: onco, description: "Comprehensive cancer care and treatments" },
    { name: "Radiology", imageUrl: radio, description: "Advanced imaging and diagnostic services" },
    { name: "Physical Therapy", imageUrl: therapy, description: "Rehabilitation services to improve mobility and function" },
    { name: "Dermatology", imageUrl: derma, description: "Specialized care for skin, hair, and nail conditions" },
    { name: "ENT", imageUrl: ent, description: "Treatment for ear, nose, and throat disorders" },
  ];

  const features = [
    {
      icon: <FaUserMd />,
      title: "Expert Specialists",
      description: "Access to a network of qualified medical professionals across various specialties."
    },
    {
      icon: <FaCalendarAlt />,
      title: "Easy Scheduling",
      description: "Book appointments online anytime, anywhere with our user-friendly platform."
    },
    {
      icon: <FaHeartbeat />,
      title: "Health Monitoring",
      description: "Track your health metrics and receive personalized insights and recommendations."
    },
    {
      icon: <FaCommentMedical />,
      title: "Virtual Consultations",
      description: "Connect with healthcare providers remotely through secure video consultations."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "MediConnect has transformed how I manage my healthcare. The appointment booking system is intuitive, and I love being able to access my medical records anytime."
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "As a healthcare provider, MediConnect has streamlined my practice. The platform helps me manage appointments efficiently and stay connected with my patients."
    },
    {
      name: "Emily Rodriguez",
      role: "Patient",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "I was skeptical about digital healthcare platforms, but MediConnect exceeded my expectations. The virtual consultations have been a game-changer for my busy schedule."
    }
  ];

  const responsive = {
    superLarge: { breakpoint: { max: 4000, min: 1600 }, items: 5, slidesToSlide: 1 },
    desktop: { breakpoint: { max: 1600, min: 1200 }, items: 4, slidesToSlide: 1 },
    tablet: { breakpoint: { max: 1200, min: 768 }, items: 3, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 768, min: 576 }, items: 2, slidesToSlide: 1 },
    smallMobile: { breakpoint: { max: 576, min: 0 }, items: 1, slidesToSlide: 1 },
  };

  const testimonialResponsive = {
    desktop: { breakpoint: { max: 4000, min: 992 }, items: 3, slidesToSlide: 1 },
    tablet: { breakpoint: { max: 992, min: 576 }, items: 2, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 576, min: 0 }, items: 1, slidesToSlide: 1 },
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-text animate-fade-in">
            <h1>Your Health, Our Priority</h1>
            <p>MediConnect streamlines healthcare access by connecting you with qualified medical professionals for seamless appointment booking and health management.</p>
            <div className="hero-buttons">
              <Link to="/appointment" className="btn-primary">
                <FaCalendarAlt /> Book Appointment
              </Link>
              <Link to="/consultants" className="btn-secondary">
                <FaUserMd /> Find Specialists
              </Link>
            </div>
          </div>
          <div className="hero-image animate-slide-in">
            <img src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" alt="Healthcare Professional" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose MediConnect?</h2>
            <p>Experience healthcare reimagined with our innovative platform</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card animate-fade-in-delay">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="departments-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Medical Departments</h2>
            <p>Comprehensive healthcare services across various specialties</p>
          </div>
          <Carousel 
            responsive={responsive} 
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            customTransition="transform 500ms ease-in-out"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["smallMobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding"
          >
          {departmentsArray.map((depart, index) => (
            <div key={index} className="department-card">
                <div className="department-image">
              <img src={depart.imageUrl} alt={depart.name} />
                  <div className="department-overlay"></div>
                </div>
                <div className="department-content">
                  <h3>{depart.name}</h3>
                  <p>{depart.description}</p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-overlay"></div>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item animate-count">
              <div className="stat-icon"><FaUserMd /></div>
              <div className="stat-number">50+</div>
              <div className="stat-label">Specialists</div>
            </div>
            <div className="stat-item animate-count">
              <div className="stat-icon"><FaHospital /></div>
              <div className="stat-number">10+</div>
              <div className="stat-label">Departments</div>
            </div>
            <div className="stat-item animate-count">
              <div className="stat-icon"><FaHeartbeat /></div>
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Patients Served</div>
            </div>
            <div className="stat-item animate-count">
              <div className="stat-icon"><FaMedal /></div>
              <div className="stat-number">15+</div>
              <div className="stat-label">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What People Say About Us</h2>
            <p>Trusted by patients and healthcare providers alike</p>
          </div>
          <Carousel 
            responsive={testimonialResponsive} 
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={5000}
            keyBoardControl={true}
            customTransition="transform 500ms ease-in-out"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding"
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="quote">"</div>
                  <p>{testimonial.text}</p>
                </div>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
            </div>
          ))}
        </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content animate-fade-in">
            <h2>Ready to Take Control of Your Health?</h2>
            <p>Join MediConnect today and experience healthcare designed around you.</p>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;