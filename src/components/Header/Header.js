import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../Header/m-c.png';
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { resetSate } from '../../Redux/slices/patientAuthSlice';
import './Header.css';

function Header() {
  const { isLogin } = useSelector(state => state.patientAuthorLoginSlice);
  const dispatch = useDispatch();
  const [showNav, setShowNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function signOut() {
    dispatch(resetSate());
    setShowNav(false);
  }

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="nav container">
        <Link to={'/'} className="nav__logo">
          <img src={logo} alt="logo" className="logo-img" /> 
          <span>MediConnect</span>
        </Link>

        <div className={showNav ? "nav__menu show-menu" : "nav__menu"}>
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink to={"/"} className={({isActive}) => isActive ? "nav__link active" : "nav__link"} onClick={() => setShowNav(false)}>
                Home
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to={"/appointment"} className={({isActive}) => isActive ? "nav__link active" : "nav__link"} onClick={() => setShowNav(false)}>
                Appointment
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to={"/consultants"} className={({isActive}) => isActive ? "nav__link active" : "nav__link"} onClick={() => setShowNav(false)}>
                Consultants
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to={"/about"} className={({isActive}) => isActive ? "nav__link active" : "nav__link"} onClick={() => setShowNav(false)}>
                About Us
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to={"/contact"} className={({isActive}) => isActive ? "nav__link active" : "nav__link"} onClick={() => setShowNav(false)}>
                Contact
              </NavLink>
            </li>
            {isLogin ? (
              <li className="nav__item nav__item-btn">
                <NavLink to="/" className="nav__link btn" onClick={signOut}>
                  Sign Out
                </NavLink>
              </li>
            ) : (
              <li className="nav__item nav__item-btn">
                <NavLink to="/login" className="nav__link btn" onClick={() => setShowNav(false)}>
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        <div className="nav__toggle" onClick={() => setShowNav(!showNav)}>
          {showNav ? <FaTimes /> : <GiHamburgerMenu />}
        </div>
      </nav>
    </header>
  );
}

export default Header;