import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaHospital, FaClipboardList, FaArrowRight, FaInfoCircle, FaClock } from 'react-icons/fa';
import './Appointment.css';
import { ApiUrlContext } from '../../App';

const Appointment = () => {
    const apiUrl = useContext(ApiUrlContext);
    const { isLogin, currentpatient } = useSelector(state => state.patientAuthorLoginSlice);
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedDept, setSelectedDept] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const departmentsArray = [
        "Pediatrics", "Orthopedics", "Cardiology", "Neurology",
        "Oncology", "Radiology", "Physical Therapy", "Dermatology", "ENT",
    ];

    useEffect(() => {
        const getDoctors = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${apiUrl}/doctor-api/doctors`);
                if (res.data && Array.isArray(res.data.doctors)) {
                    setDoctors(res.data.doctors);
                }
            } catch (error) {
                console.error("Failed to fetch doctors", error);
                toast.error("Could not fetch doctor information.");
            } finally {
                setLoading(false);
            }
        };
        getDoctors();

        // Check if there's a selected department and doctor in localStorage
        const savedDepartment = localStorage.getItem('selectedDepartment');
        const savedDoctor = localStorage.getItem('selectedDoctor');
        
        if (savedDepartment) {
            setSelectedDept(savedDepartment);
            setValue('department', savedDepartment);
        }
        
        if (savedDoctor) {
            setValue('doctor', savedDoctor);
        }

        // Clear localStorage after using the values
        localStorage.removeItem('selectedDepartment');
        localStorage.removeItem('selectedDoctor');
    }, [setValue, apiUrl]);

    useEffect(() => {
        if (selectedDept) {
            setFilteredDoctors(doctors.filter(doc => doc.department === selectedDept));
        } else {
            setFilteredDoctors([]);
        }
    }, [selectedDept, doctors]);

    const handleAppointmentSubmit = async (data) => {
        if (!isLogin) {
            toast.error("Please login to book an appointment.");
            return;
        }
        setSubmitLoading(true);
        const appointmentData = {
            ...data,
            patientId: currentpatient._id,
            status: 'Pending',
            hasVisited: false,
        };

        try {
            const res = await axios.post(`${apiUrl}/patient-api/appointment`, appointmentData);
            if (res.data.message === 'appointemt successFull') {
                toast.success("Appointment booked successfully!");
                reset();
                setSelectedDept("");
                setCurrentStep(1);
            } else {
                toast.error(res.data.message || "Failed to book appointment.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An unexpected error occurred. Please try again.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderStepIndicator = () => {
    return (
            <div className="step-indicator">
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-title">Personal Information</div>
                </div>
                <div className="step-connector"></div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-title">Department & Doctor</div>
                </div>
                <div className="step-connector"></div>
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-title">Appointment Details</div>
                </div>
                    </div>
        );
    };

    const renderStep1 = () => {
        return (
            <div className="form-step">
                <h3 className="step-heading">
                    <FaUserMd className="step-icon" />
                    Personal Information
                </h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name</label>
                        <input 
                            type="text" 
                            {...register("FirstName", { required: "First Name is required" })} 
                            defaultValue={currentpatient?.FirstName} 
                            className={errors.FirstName ? "error" : ""}
                        />
                                {errors.FirstName && <p className="error-text">{errors.FirstName.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                        <input 
                            type="text" 
                            {...register("LastName", { required: "Last Name is required" })} 
                            defaultValue={currentpatient?.LastName} 
                            className={errors.LastName ? "error" : ""}
                        />
                                {errors.LastName && <p className="error-text">{errors.LastName.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                        <input 
                            type="email" 
                            {...register("email", { required: "Email is required" })} 
                            defaultValue={currentpatient?.email} 
                            className={errors.email ? "error" : ""}
                        />
                                {errors.email && <p className="error-text">{errors.email.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                        <input 
                            type="tel" 
                            {...register("mobile", { required: "Mobile Number is required" })} 
                            defaultValue={currentpatient?.mobile} 
                            className={errors.mobile ? "error" : ""}
                        />
                                {errors.mobile && <p className="error-text">{errors.mobile.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                        <input 
                            type="date" 
                            {...register("dob", { required: "Date of Birth is required" })} 
                            defaultValue={currentpatient?.dob?.split('T')[0]} 
                            className={errors.dob ? "error" : ""}
                        />
                                {errors.dob && <p className="error-text">{errors.dob.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                        <select 
                            {...register("gender", { required: "Gender is required" })} 
                            defaultValue={currentpatient?.gender}
                            className={errors.gender ? "error" : ""}
                        >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                {errors.gender && <p className="error-text">{errors.gender.message}</p>}
                            </div>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn-primary" onClick={nextStep}>
                        Next Step <FaArrowRight />
                    </button>
                            </div>
                            </div>
        );
    };

    const renderStep2 = () => {
        return (
            <div className="form-step">
                <h3 className="step-heading">
                    <FaHospital className="step-icon" />
                    Department & Doctor
                </h3>
                <div className="form-grid">
                            <div className="form-group">
                                <label>Department</label>
                                <select
                                    {...register("department", { required: "Department is required" })}
                                    onChange={(e) => setSelectedDept(e.target.value)}
                            className={errors.department ? "error" : ""}
                                >
                                    <option value="">Select Department</option>
                                    {departmentsArray.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                </select>
                                {errors.department && <p className="error-text">{errors.department.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Doctor</label>
                        <select 
                            {...register("doctor", { required: "Doctor is required" })} 
                            disabled={!selectedDept || loading}
                            className={errors.doctor ? "error" : ""}
                        >
                            <option value="">
                                {loading ? "Loading doctors..." : selectedDept ? "Select Doctor" : "Select Department First"}
                            </option>
                                    {filteredDoctors.map((doctor) => (
                                        <option key={doctor._id} value={`${doctor.FirstName} ${doctor.LastName}`}>
                                            Dr. {doctor.FirstName} {doctor.LastName}
                                        </option>
                                    ))}
                                </select>
                                {errors.doctor && <p className="error-text">{errors.doctor.message}</p>}
                            </div>
                    {selectedDept && filteredDoctors.length === 0 && !loading && (
                        <div className="info-message">
                            No doctors available for this department. Please select another department.
                        </div>
                    )}
                </div>
                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={prevStep}>
                        Back
                    </button>
                    <button type="button" className="btn-primary" onClick={nextStep}>
                        Next Step <FaArrowRight />
                    </button>
                </div>
            </div>
        );
    };

    const renderStep3 = () => {
        return (
            <div className="form-step">
                <h3 className="step-heading">
                    <FaCalendarAlt className="step-icon" />
                    Appointment Details
                </h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Appointment Date</label>
                        <input 
                            type="date" 
                            {...register("dateOfAppointment", { 
                                required: "Appointment Date is required",
                                validate: value => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const selectedDate = new Date(value);
                                    return selectedDate >= today || "Please select a future date";
                                }
                            })} 
                            min={new Date().toISOString().split('T')[0]}
                            className={errors.dateOfAppointment ? "error" : ""}
                        />
                        {errors.dateOfAppointment && <p className="error-text">{errors.dateOfAppointment.message}</p>}
                    </div>
                    <div className="form-group">
                        <label>Appointment Time</label>
                        <input 
                            type="time" 
                            {...register("timeOfAppointment", { required: "Appointment Time is required" })} 
                            className={errors.timeOfAppointment ? "error" : ""}
                        />
                        {errors.timeOfAppointment && <p className="error-text">{errors.timeOfAppointment.message}</p>}
                    </div>
                            <div className="form-group full-width">
                                <label>Reason For Visit</label>
                        <textarea 
                            placeholder="Please describe your symptoms or reason for the appointment" 
                            {...register("ReasonForVist", { required: "Reason for visit is required" })} 
                            rows="4"
                            className={errors.ReasonForVist ? "error" : ""}
                        ></textarea>
                                {errors.ReasonForVist && <p className="error-text">{errors.ReasonForVist.message}</p>}
                            </div>
                        </div>
                        <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={prevStep}>
                        Back
                    </button>
                    <button type="submit" className="btn-primary" disabled={submitLoading}>
                        {submitLoading ? (
                            <>
                                <span className="spinner"></span> Booking...
                            </>
                        ) : (
                            <>
                                <FaCalendarAlt /> Book Appointment
                            </>
                        )}
                            </button>
                </div>
            </div>
        );
    };

    return (
        <section className="appointment-page">
            <div className="appointment-hero">
                <div className="appointment-hero-overlay"></div>
                <div className="appointment-hero-content">
                    <h1>Book an Appointment</h1>
                    <p>Schedule your visit with our healthcare professionals</p>
                </div>
            </div>

            <div className="container">
                {!isLogin ? (
                    <div className="login-prompt">
                        <FaUserMd className="login-icon" />
                        <h2>Please Login to Continue</h2>
                        <p>You need to be logged in to book an appointment with our specialists.</p>
                        <NavLink to="/login" className="btn-primary">Login Now</NavLink>
                    </div>
                ) : (
                    <>
                        <div className="appointment-info">
                            <FaInfoCircle className="info-icon" />
                            <p>Fill out the form below to schedule an appointment with one of our specialists. We'll confirm your appointment via email.</p>
                        </div>
                        {renderStepIndicator()}
                        <div className="appointment-card">
                            <form onSubmit={handleSubmit(handleAppointmentSubmit)} className="appointment-form">
                                {currentStep === 1 && renderStep1()}
                                {currentStep === 2 && renderStep2()}
                                {currentStep === 3 && renderStep3()}
                    </form>
                        </div>
                        <div className="appointment-actions">
                            <Link to="/previous-appointments" className="view-appointments-link">
                                <FaClock /> View Previous Appointments
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Appointment;
