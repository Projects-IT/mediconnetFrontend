import React, { useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { patientAuthorThunk } from '../../Redux/slices/patientAuthSlice';
import { ApiUrlContext } from '../../App';

function Login() {
  const { register, handleSubmit } = useForm();
  const { isLogin, errOccurred, errMes } = useSelector(state => state.patientAuthorLoginSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = useContext(ApiUrlContext);

  function handleLogin(credObj) {
    dispatch(patientAuthorThunk({ patientCredObj: credObj, apiUrl }));
  }

  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Sign In</h2>
        <p className="login-subtitle">Welcome back! Please login to continue.</p>
        
        {errOccurred && (
          <div className="error-message">
            {errMes}
          </div>
        )}

        <form onSubmit={handleSubmit(handleLogin)} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
              className="form-input"
            />
          </div>
          <button type="submit" className="btn login-btn">Login</button>
        </form>

        <div className="register-link">
          <p>Not Registered? <Link to={"/register"}>Register Now</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
