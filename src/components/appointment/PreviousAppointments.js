import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaExclamationTriangle, FaStar, FaClock } from 'react-icons/fa';
import './Appointment.css';
import { ApiUrlContext } from '../../App';

const PreviousAppointments = () => {
    const apiUrl = useContext(ApiUrlContext);
    const { currentpatient } = useSelector(state => state.patientAuthorLoginSlice);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [feedbackData, setFeedbackData] = useState({
        punctuality: 5,
        communication: 5,
        treatment: 5,
        care: 5,
        facilities: 5,
        overallRating: 5,
        comments: ''
    });

    const getPreviousAppointments = async () => {
        try {
            if (!currentpatient || !currentpatient.FirstName) {
                setError("User information not available. Please login again.");
                setLoading(false);
                return;
            }
            
            const fullName = `${currentpatient.FirstName} ${currentpatient.LastName}`;
            const res = await axios.get(`${apiUrl}/patient-api/perviousAppointment/${fullName}`);
            
            if (res.data.message === "Previous appointments") {
                setAppointments(res.data.PerviousAppointments);
            } else {
                setError("Could not retrieve appointment data.");
            }
        } catch (err) {
            setError("An error occurred while fetching your appointments.");
            console.error("Error fetching appointments:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPreviousAppointments();
    }, [currentpatient, apiUrl]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };

    const getStatusClass = (status) => {
        switch(status?.toLowerCase()) {
            case 'completed':
                return 'status-completed';
            case 'accepted':
                return 'status-accepted';
            case 'rejected':
                return 'status-rejected';
            case 'pending':
            default:
                return 'status-pending';
        }
    };

    const handleOpenFeedback = (appointment) => {
        // Check if appointment has doctorId
        if (!appointment.doctorId) {
            // Try to fetch doctor ID before opening the feedback modal
            axios.get(`${apiUrl}/patient-api/perviousAppointment/${currentpatient.FirstName} ${currentpatient.LastName}`)
                .then(res => {
                    if (res.data.message === "Previous appointments") {
                        // Find the appointment with updated doctorId
                        const updatedAppointments = res.data.PerviousAppointments;
                        const updatedAppointment = updatedAppointments.find(app => app._id === appointment._id);
                        
                        if (updatedAppointment && updatedAppointment.doctorId) {
                            setSelectedAppointment(updatedAppointment);
                            setShowFeedbackModal(true);
                        } else {
                            alert("Could not retrieve doctor information. Please try again later.");
                        }
                    }
                })
                .catch(err => {
                    console.error("Error refreshing appointment data:", err);
                    alert("Could not retrieve doctor information. Please try again later.");
                });
        } else {
            setSelectedAppointment(appointment);
            setShowFeedbackModal(true);
        }
    };

    const handleCloseFeedback = () => {
        setShowFeedbackModal(false);
        setSelectedAppointment(null);
    };

    const handleFeedbackChange = (e) => {
        const { name, value } = e.target;
        setFeedbackData({
            ...feedbackData,
            [name]: value
        });
    };

    const handleRatingChange = (category, rating) => {
        setFeedbackData({
            ...feedbackData,
            [category]: rating
        });
    };

    const calculateOverallRating = () => {
        const { punctuality, communication, treatment, care, facilities } = feedbackData;
        const overall = (
            parseInt(punctuality) + 
            parseInt(communication) + 
            parseInt(treatment) + 
            parseInt(care) + 
            parseInt(facilities)
        ) / 5;
        return overall.toFixed(1);
    };

    const handleSubmitFeedback = async () => {
        try {
            if (!selectedAppointment) return;
            
            const overallRating = calculateOverallRating();
            
            // Check if we have a doctorId
            if (!selectedAppointment.doctorId) {
                console.error("Doctor ID is missing from appointment data");
                alert("Could not submit feedback: Missing doctor information");
                return;
            }
            
            const feedbackPayload = {
                appointmentId: selectedAppointment._id,
                doctorId: selectedAppointment.doctorId,
                doctorName: selectedAppointment.doctor,
                patientId: currentpatient._id,
                patientName: `${currentpatient.FirstName} ${currentpatient.LastName}`,
                department: selectedAppointment.department,
                date: selectedAppointment.dateOfAppointment,
                ratings: {
                    punctuality: parseInt(feedbackData.punctuality),
                    communication: parseInt(feedbackData.communication),
                    treatment: parseInt(feedbackData.treatment),
                    care: parseInt(feedbackData.care),
                    facilities: parseInt(feedbackData.facilities),
                    overall: parseFloat(overallRating)
                },
                comments: feedbackData.comments,
                createdAt: new Date()
            };
            
            // Submit feedback first
            const response = await axios.post(`${apiUrl}/patient-api/feedback`, feedbackPayload);
            
            if (response.data.message === "Feedback submitted successfully") {
                // Update doctor rating in the backend
                if (selectedAppointment.doctorId) {
                    try {
                        await axios.post(`${apiUrl}/doctor-api/update-rating/${selectedAppointment.doctorId}`, {
                            rating: parseFloat(overallRating)
                        });
                    } catch (ratingErr) {
                        console.error("Error updating doctor rating:", ratingErr);
                        // Continue with success message even if rating update fails
                    }
                }
                
                alert("Thank you for your feedback!");
                handleCloseFeedback();
                getPreviousAppointments(); // Refresh the appointments list
            }
        } catch (err) {
            console.error("Error submitting feedback:", err);
            alert("Failed to submit feedback. Please try again.");
        }
    };

    const renderStarRating = (category, value) => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar 
                        key={star}
                        className={star <= feedbackData[category] ? "star active" : "star"}
                        onClick={() => handleRatingChange(category, star)}
                    />
                ))}
            </div>
        );
    };

    return (
        <section className="previous-appointments-page">
            <div className="appointment-hero">
                <div className="appointment-hero-overlay"></div>
                <div className="appointment-hero-content">
                    <h1>Your Appointments</h1>
                    <p>A record of your past and upcoming appointments</p>
                </div>
            </div>

            <div className="container">
                <div className="appointments-container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading your appointments...</p>
                </div>
                ) : error ? (
                        <div className="error-state">
                            <FaExclamationTriangle className="error-icon" />
                            <h3>Error</h3>
                            <p>{error}</p>
                            <Link to="/appointment" className="btn-primary">Book New Appointment</Link>
                        </div>
                ) : appointments.length > 0 ? (
                    <div className="appointments-table-container">
                        <table className="appointments-table">
                            <thead>
                                <tr>
                                    <th>Doctor</th>
                                    <th>Department</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                    <th>Status</th>
                                        <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment._id}>
                                        <td>Dr. {appointment.doctor}</td>
                                        <td>{appointment.department}</td>
                                        <td>{formatDate(appointment.dateOfAppointment)}</td>
                                            <td>{appointment.timeOfAppointment || formatTime(appointment.dateOfAppointment)}</td>
                                            <td className="status-column">
                                                <span className={getStatusClass(appointment.status)}>
                                                    {appointment.status || 'Pending'}
                                            </span>
                                        </td>
                                            <td>
                                                {appointment.status?.toLowerCase() === 'completed' && !appointment.feedbackSubmitted && (
                                                    <button 
                                                        className="btn-feedback"
                                                        onClick={() => handleOpenFeedback(appointment)}
                                                    >
                                                        <FaStar /> Give Feedback
                                                    </button>
                                                )}
                                                {appointment.feedbackSubmitted && (
                                                    <span className="feedback-submitted">Feedback submitted</span>
                                                )}
                                            </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-appointments">
                            <FaCalendarAlt className="no-appointments-icon" />
                        <h2>No Appointments Found</h2>
                        <p>You haven't booked any appointments yet.</p>
                            <Link to="/appointment" className="btn-primary">Book an Appointment</Link>
                        </div>
                    )}

                    <div className="back-link-container">
                        <Link to="/appointment" className="back-link">
                            &larr; Back to Appointment Booking
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feedback Modal */}
            {showFeedbackModal && selectedAppointment && (
                <div className="feedback-modal-overlay">
                    <div className="feedback-modal">
                        <div className="feedback-modal-header">
                            <h3>Rate Your Experience</h3>
                            <button className="close-button" onClick={handleCloseFeedback}>×</button>
                        </div>
                        <div className="feedback-modal-body">
                            <div className="feedback-appointment-info">
                                <p><strong>Doctor:</strong> Dr. {selectedAppointment.doctor}</p>
                                <p><strong>Department:</strong> {selectedAppointment.department}</p>
                                <p><strong>Date:</strong> {formatDate(selectedAppointment.dateOfAppointment)}</p>
                            </div>
                            
                            <div className="feedback-rating-container">
                                <div className="feedback-rating-item">
                                    <label>Punctuality</label>
                                    {renderStarRating('punctuality', feedbackData.punctuality)}
                                </div>
                                
                                <div className="feedback-rating-item">
                                    <label>Communication</label>
                                    {renderStarRating('communication', feedbackData.communication)}
                                </div>
                                
                                <div className="feedback-rating-item">
                                    <label>Treatment Effectiveness</label>
                                    {renderStarRating('treatment', feedbackData.treatment)}
                                </div>
                                
                                <div className="feedback-rating-item">
                                    <label>Care & Attention</label>
                                    {renderStarRating('care', feedbackData.care)}
                                </div>
                                
                                <div className="feedback-rating-item">
                                    <label>Facilities & Cleanliness</label>
                                    {renderStarRating('facilities', feedbackData.facilities)}
                                </div>
                                
                                <div className="feedback-rating-item">
                                    <label>Overall Rating</label>
                                    <div className="overall-rating">{calculateOverallRating()}</div>
                                </div>
                            </div>
                            
                            <div className="feedback-comments">
                                <label>Additional Comments</label>
                                <textarea 
                                    name="comments" 
                                    rows="4" 
                                    placeholder="Share your experience and suggestions..."
                                    value={feedbackData.comments}
                                    onChange={handleFeedbackChange}
                                ></textarea>
                            </div>
                        </div>
                        <div className="feedback-modal-footer">
                            <button className="btn-secondary" onClick={handleCloseFeedback}>Cancel</button>
                            <button className="btn-primary" onClick={handleSubmitFeedback}>Submit Feedback</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PreviousAppointments;