import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router";
import ScrollToTop from "./component/scrollToTop";
import { Home } from "./pages/home";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import { Favorites } from "./pages/favorites";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { UserProfile } from "./pages/UserProfile";

import { Navbar } from "./component/navbar";
import { BreweryRoutes } from "./pages/BreweryRoute";
import { Brewery } from "./pages/Brewery";
import { Points } from "./pages/points";
// import { MyMap } from "./pages/MapTest";
import { BreweryReviews } from "./pages/BreweryReviwsPage";
import { Search } from "./pages/Search";
import { Footer } from "./component/footer";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop>
        <Navbar />
        <div className='container-fluid text-light'>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<BreweryRoutes />} path="/routes" />
          {/* <Route element={<MyMap />} path="/maptest" /> */}
          <Route element={<Points />} path="/points" />
          <Route element={<BreweryReviews />} path="/brewery_reviews/:id" />
          <Route element={<h1>Not found!</h1>} />
          <Route element={<Favorites />} path="/favorites" />
          <Route element={<ForgotPassword />} path="/forgot-password" />
          <Route element={<ResetPassword />} path="/reset_password/:token" />
          <Route element={<SignUp />} path="/sign-up" />
          <Route element={<UserProfile />} path="/UserProfile" />
          <Route element={<Brewery />} path="/brewery/:id" />
          <Route element={<Search />} path="/search" />
        </Routes>
        </div>
        <Footer />
      </ScrollToTop>
    </BrowserRouter>,
  </StrictMode>,
)
