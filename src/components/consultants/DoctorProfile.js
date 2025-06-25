import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FaCalendarAlt, FaUserMd, FaHospital, FaFilePdf, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaArrowLeft, FaStar } from 'react-icons/fa';
import './Consultants.css';
import { ApiUrlContext } from '../../App';

const DoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const apiUrl = useContext(ApiUrlContext);
    const { isLogin } = useSelector(state => state.patientAuthorLoginSlice);
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const defaultAvatar = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

    useEffect(() => {
        const fetchDoctor = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get(`${apiUrl}/doctor-api/doctor/${id}`);
                if (res.data && res.data.doctor) {
                    // Add experience years for demo purposes if not available
                    const doctorData = {
                        ...res.data.doctor,
                        experienceInYears: res.data.doctor.experienceInYears || Math.floor(Math.random() * 15 + 5),
                    };
                    setDoctor(doctorData);
                } else {
                    setError('Could not fetch doctor data.');
                }
            } catch (err) {
                setError('Failed to fetch doctor information. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchDoctor();
    }, [id, apiUrl]);

    const handleAvatarError = (e) => {
        e.target.src = defaultAvatar;
    };

    const handleBookAppointment = () => {
        if (!isLogin) {
            toast.warning("Please login to book an appointment");
            navigate('/login');
            return;
        }
        
        // Set department and doctor in localStorage for appointment page
        localStorage.setItem('selectedDepartment', doctor.department);
        localStorage.setItem('selectedDoctor', `${doctor.FirstName} ${doctor.LastName}`);
        navigate('/appointment');
    };

    const handleViewDocument = () => {
        navigate(`/document/${doctor.FirstName}_${doctor.LastName}`);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="doctor-profile-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading doctor profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="doctor-profile-page">
                <div className="container">
                    <div className="error-state">
                        <p>{error || "Doctor not found"}</p>
                        <button className="btn-primary" onClick={handleGoBack}>
                            <FaArrowLeft /> Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="doctor-profile-page">
            <div className="doctor-profile-hero">
                <div className="doctor-profile-hero-overlay"></div>
                <div className="container">
                    <div className="doctor-profile-header">
                        <button className="back-btn" onClick={handleGoBack}>
                            <FaArrowLeft /> Back to Consultants
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="container">
                <div className="doctor-profile-card">
                    <div className="doctor-profile-main">
                        <div className="doctor-profile-image-container">
                            <img 
                                src={doctor.avthar || defaultAvatar} 
                                alt={`Dr. ${doctor.FirstName} ${doctor.LastName}`}
                                className="doctor-profile-image"
                                onError={handleAvatarError}
                            />
                            <div className="doctor-rating profile-rating">
                                <FaStar className="rating-icon" />
                                <span>{doctor.rating ? doctor.rating : "New"}</span>
                                {doctor.totalReviews > 0 && 
                                    <span className="review-count">({doctor.totalReviews} reviews)</span>
                                }
                            </div>
                        </div>
                        
                        <div className="doctor-profile-details">
                            <h1>Dr. {doctor.FirstName} {doctor.LastName}</h1>
                            <p className="doctor-profile-department">{doctor.department}</p>
                            
                            <div className="doctor-profile-info-grid">
                                <div className="doctor-profile-info-item">
                                    <FaGraduationCap className="info-icon" />
                                    <div>
                                        <h4>Qualification</h4>
                                        <p>{doctor.qualification || 'MBBS, MD'}</p>
                                    </div>
                                </div>
                                
                                <div className="doctor-profile-info-item">
                                    <FaBriefcase className="info-icon" />
                                    <div>
                                        <h4>Experience</h4>
                                        <p>{doctor.experienceInYears} years</p>
                                    </div>
                                </div>
                                
                                <div className="doctor-profile-info-item">
                                    <FaHospital className="info-icon" />
                                    <div>
                                        <h4>Specialization</h4>
                                        <p>{doctor.department}</p>
                                    </div>
                                </div>
                                
                                {doctor.email && (
                                    <div className="doctor-profile-info-item">
                                        <FaEnvelope className="info-icon" />
                                        <div>
                                            <h4>Email</h4>
                                            <p>{doctor.email}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {doctor.mobile && (
                                    <div className="doctor-profile-info-item">
                                        <FaPhone className="info-icon" />
                                        <div>
                                            <h4>Contact</h4>
                                            <p>{doctor.mobile}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {doctor.address && (
                                    <div className="doctor-profile-info-item">
                                        <FaMapMarkerAlt className="info-icon" />
                                        <div>
                                            <h4>Address</h4>
                                            <p>{doctor.address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="doctor-profile-actions">
                                <button className="btn-primary" onClick={handleBookAppointment}>
                                    <FaCalendarAlt /> Book Appointment
                                </button>
                                <button className="btn-outline" onClick={handleViewDocument}>
                                    <FaFilePdf /> View Documents
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {doctor.about && (
                        <div className="doctor-profile-about">
                            <h3>About Dr. {doctor.FirstName} {doctor.LastName}</h3>
                            <p>{doctor.about}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile; 