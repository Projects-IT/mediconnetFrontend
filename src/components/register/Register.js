import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiUrlContext } from '../../App';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const apiUrl = useContext(ApiUrlContext);

  async function handleRegister(obj) {
    try {
      const res = await axios.post(`${apiUrl}/patient-api/patient`, obj);
      if (res.data.message === 'new patient register') {
        navigate('/login');
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      setErr('An unexpected error occurred. Please try again.');
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join us to manage your health with ease.</p>

        {err && <div className="error-message">{err}</div>}

        <form onSubmit={handleSubmit(handleRegister)} className="register-form">
          <div className="form-grid">
            <div className="form-group">
              <input type="text" placeholder="First Name" {...register("FirstName", { required: "First Name is required" })} className="form-input" />
              {errors.FirstName && <p className="error-text">{errors.FirstName.message}</p>}
            </div>
            <div className="form-group">
              <input type="text" placeholder="Last Name" {...register("LastName", { required: "Last Name is required" })} className="form-input" />
              {errors.LastName && <p className="error-text">{errors.LastName.message}</p>}
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email" {...register("email", { required: "Email is required" })} className="form-input" />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>
            <div className="form-group">
              <input type="tel" placeholder="Mobile Number" {...register("mobile", { required: "Mobile Number is required" })} className="form-input" />
              {errors.mobile && <p className="error-text">{errors.mobile.message}</p>}
            </div>
            <div className="form-group">
              <input type="date" placeholder="Date of Birth" {...register("dateOfBirth", { required: "Date of Birth is required" })} className="form-input" />
              {errors.dateOfBirth && <p className="error-text">{errors.dateOfBirth.message}</p>}
            </div>
            <div className="form-group">
              <select {...register("gender", { required: "Gender is required" })} className="form-input">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <p className="error-text">{errors.gender.message}</p>}
            </div>
            <div className="form-group full-width">
              <input type="password" placeholder="Password" {...register("password", { required: "Password is required", minLength: { value: 5, message: "Password must be at least 5 characters" } })} className="form-input" />
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>
          </div>
          <button type="submit" className="btn register-btn">Register</button>
        </form>

        <div className="login-link">
          <p>Already Registered? <Link to="/login">Login Now</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;