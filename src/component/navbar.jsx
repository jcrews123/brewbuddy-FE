import {  useEffect } from "react";
import { Link, useNavigate } from "react-router";
import "../styles/navbar.css";
import useDefaultStore from "../store/store";

export const Navbar = () => {
    const store = useDefaultStore()
    const actions = useDefaultStore()
    const navigate = useNavigate();

    useEffect(() => {
        if (store.token) {
            actions.fetchUserInfo();
        }
    }, [store.token, actions]);

    const handleLogout = () => {
        actions.logout();
        navigate("/");
    }

    return (
        <nav className="navbar navbar-expand-lg py-3">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                {/* Logo section */}
                <div>
                    <img src={"/img/HomeLogo2.png"} alt="Home Icon" className="navbar-logo" />
                </div>
                <Link to="/search" className="nav-link d-flex flex-row align-items-center my-auto mx-3">
                    <img src={"/img/searchLogo1.png"} alt="Search Icon" className="search-icon" />
                    <span className="home-text mt-1">Search</span>
                </Link>

                {/* Responsive toggle for mobile */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar links and user info */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mt-1">
                        {store.token && (
                            <>
                                
                                <li className="nav-item">
                                    <Link to="/favorites" className="nav-link">Favorites</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/routes" className="nav-link">Build A Route</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/points" className="nav-link">
                                        Redeem Points
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    {/* User Profile Section */}
                    <div className="d-flex align-items-center ms-auto">
                        {store.token ? (
                            <>
                                <span className="text-white me-3">Hello, {store.userEmail.split('@')[0]}!</span>
                                {store.userProfileImageId && (
                                    <img
                                        src={store.userProfileImageId}
                                        alt="Profile"
                                        className="rounded-circle me-3 profile-image"
                                    />
                                )}
                                <Link to="/UserProfile" className="btn btn-outline-light me-2">Profile</Link>
                                <button onClick={handleLogout} className="btn btn-danger">Log Out</button>
                            </>
                        ) : (
                            <Link to="/login">
                                <button className="btn btn-outline-light">Log In</button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
		</nav >
	);
};