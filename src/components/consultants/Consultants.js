import React, { useEffect, useState, useMemo, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaStethoscope, FaSearch, FaStar, FaUserMd, FaCalendarAlt, FaInfoCircle, FaFilePdf, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaHospital } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import './Consultants.css';
import { ApiUrlContext } from '../../App';

const DoctorDetailsModal = ({ doctor, onClose, onBookAppointment }) => {
    if (!doctor) return null;
    
    const defaultAvatar = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
    
    const handleAvatarError = (e) => {
        e.target.src = defaultAvatar;
    };
    
    const handleViewDocument = () => {
        window.open(`/document/${doctor.FirstName}_${doctor.LastName}`, '_blank');
    };
    
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="doctor-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Dr. {doctor.FirstName} {doctor.LastName}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                
                <div className="modal-body">
                    <div className="doctor-profile">
                        <div className="doctor-image-container">
                            <img 
                                src={doctor.avthar || defaultAvatar} 
                                alt={`Dr. ${doctor.FirstName} ${doctor.LastName}`}
                                className="doctor-image"
                                onError={handleAvatarError}
                            />
                        </div>
                        
                        <div className="doctor-info">
                            <div className="info-group">
                                <FaGraduationCap className="info-icon" />
                                <div>
                                    <h4>Qualification</h4>
                                    <p>{doctor.qualification || 'MBBS, MD'}</p>
                                </div>
                            </div>
                            
                            <div className="info-group">
                                <FaBriefcase className="info-icon" />
                                <div>
                                    <h4>Experience</h4>
                                    <p>{doctor.experienceInYears} years</p>
                                </div>
                            </div>
                            
                            <div className="info-group">
                                <FaHospital className="info-icon" />
                                <div>
                                    <h4>Specialization</h4>
                                    <p>{doctor.department}</p>
                                </div>
                            </div>
                            
                            {doctor.email && (
                                <div className="info-group">
                                    <FaEnvelope className="info-icon" />
                                    <div>
                                        <h4>Email</h4>
                                        <p>{doctor.email}</p>
                                    </div>
                                </div>
                            )}
                            
                            {doctor.mobile && (
                                <div className="info-group">
                                    <FaPhone className="info-icon" />
                                    <div>
                                        <h4>Contact</h4>
                                        <p>{doctor.mobile}</p>
                                    </div>
                                </div>
                            )}
                            
                            {doctor.address && (
                                <div className="info-group">
                                    <FaMapMarkerAlt className="info-icon" />
                                    <div>
                                        <h4>Address</h4>
                                        <p>{doctor.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {doctor.about && (
                        <div className="doctor-about">
                            <h3>About</h3>
                            <p>{doctor.about}</p>
                        </div>
                    )}
                    
                    <div className="doctor-documents">
                        <h3>Documents</h3>
                        <button className="document-btn" onClick={handleViewDocument}>
                            <FaFilePdf /> View Doctor Documents
                        </button>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button className="btn-outline" onClick={onClose}>
                        Close
                    </button>
                    <button className="btn-primary" onClick={() => onBookAppointment(doctor)}>
                        <FaCalendarAlt /> Book Appointment
                    </button>
                </div>
            </div>
        </div>
    );
};

const Consultants = () => {
    const apiUrl = useContext(ApiUrlContext);
    const { isLogin } = useSelector(state => state.patientAuthorLoginSlice);
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('name'); // 'name', 'experience', 'rating'
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const defaultAvatar = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get(`${apiUrl}/doctor-api/doctors`);
                if (res.data && Array.isArray(res.data.doctors)) {
                    // Add experience years for demo purposes if not available
                    const activeDoctors = res.data.doctors.map(doc => ({
                        ...doc,
                        experienceInYears: doc.experienceInYears || Math.floor(Math.random() * 15 + 5),
                    }));
                    setDoctors(activeDoctors);
                    const uniqueDepts = ['All', ...new Set(activeDoctors.map(doc => doc.department))];
                    setDepartments(uniqueDepts);
                } else {
                    setError('Could not fetch doctors data.');
                }
            } catch (err) {
                setError('Failed to fetch doctors. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, [apiUrl]);

    const filteredDoctors = useMemo(() => {
        let filtered = doctors
            .filter(doctor => selectedDept === 'All' || doctor.department === selectedDept)
            .filter(doctor =>
                `${doctor.FirstName} ${doctor.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
        // Sort the filtered doctors
        return filtered.sort((a, b) => {
            if (sortBy === 'name') {
                return `${a.FirstName} ${a.LastName}`.localeCompare(`${b.FirstName} ${b.LastName}`);
            } else if (sortBy === 'experience') {
                return (b.experienceInYears || 0) - (a.experienceInYears || 0);
            } else if (sortBy === 'rating') {
                // Convert ratings to numbers for comparison
                const ratingA = parseFloat(a.rating || 0);
                const ratingB = parseFloat(b.rating || 0);
                return ratingB - ratingA;
            }
            return 0;
        });
    }, [doctors, selectedDept, searchTerm, sortBy]);

    const handleAvatarError = (e) => {
        e.target.src = defaultAvatar;
    };

    const handleBookAppointment = (doctor) => {
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

    const handleViewProfile = (doctor) => {
        // Option 1: Show modal
        setSelectedDoctor(doctor);
        
        // Option 2: Navigate to doctor profile page
        // navigate(`/doctor/${doctor._id}`);
    };

    const closeModal = () => {
        setSelectedDoctor(null);
    };

    return (
        <div className="consultants-page">
            <div className="consultants-hero">
                <div className="consultants-hero-overlay"></div>
                <div className="consultants-hero-content">
                    <h1>Our Medical Professionals</h1>
                    <p>Meet our team of experienced and skilled doctors ready to provide you with the best healthcare services.</p>
                </div>
            </div>

            <div className="container">
                <div className="filters-section">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by name or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-options">
                        <div className="filter-group">
                            <label htmlFor="department-select">
                                <FaStethoscope /> Department
                            </label>
                        <select
                                id="department-select"
                                className="filter-select"
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            >
                                {departments.map((dept, index) => (
                                    <option key={index} value={dept}>
                                        {dept}
                                    </option>
                            ))}
                        </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="sort-select">
                                <FaUserMd /> Sort By
                            </label>
                            <select
                                id="sort-select"
                                className="filter-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="name">Name (A-Z)</option>
                                <option value="experience">Experience (High-Low)</option>
                                <option value="rating">Rating (High-Low)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="results-count">
                    <p>
                        Found <span>{filteredDoctors.length}</span> {filteredDoctors.length === 1 ? 'doctor' : 'doctors'} matching your criteria
                    </p>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading doctors...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">{error}</div>
                ) : filteredDoctors.length > 0 ? (
                    <div className="consultants-grid">
                        {filteredDoctors.map((doctor) => (
                            <div className="consultant-card" key={doctor._id}>
                                <div className="card-header">
                                    <div className="avatar-container">
                                        <img
                                            src={doctor.avthar || defaultAvatar}
                                            alt={`Dr. ${doctor.FirstName} ${doctor.LastName}`}
                                            className="consultant-avatar"
                                            onError={handleAvatarError}
                                        />
                                        <div className="doctor-rating">
                                            <FaStar className="rating-icon" />
                                            <span>{doctor.rating ? doctor.rating : "New"}</span>
                                            {doctor.totalReviews > 0 && 
                                                <span className="review-count">({doctor.totalReviews})</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="consultant-info">
                                        <h3 className="consultant-name">Dr. {doctor.FirstName} {doctor.LastName}</h3>
                                        <p className="consultant-department">{doctor.department}</p>
                                        <div className="rating">
                                            <span className="rating-value">{doctor.experienceInYears} years experience</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="card-actions">
                                        <button 
                                            className="btn-outline" 
                                            onClick={() => handleViewProfile(doctor)}
                                        >
                                            <FaInfoCircle /> View Details
                                        </button>
                                        <button 
                                            className="btn-primary"
                                            onClick={() => handleBookAppointment(doctor)}
                                        >
                                            <FaCalendarAlt /> Book Appointment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <FaUserMd className="no-results-icon" />
                        <h3>No doctors found</h3>
                        <p>Try adjusting your filters or search term to find doctors.</p>
                    </div>
                )}
            </div>

            {selectedDoctor && (
                <DoctorDetailsModal
                    doctor={selectedDoctor}
                    onClose={closeModal}
                    onBookAppointment={handleBookAppointment}
                />
            )}
        </div>
    );
};

export default Consultants;
