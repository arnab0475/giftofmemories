import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import AdminLogin from "./pages/AdminLogin";
import DashboardPage from "./pages/DashboardPage";
import { ToastContainer } from "react-toastify";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/admin-portal-secret", "/dashboard"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-warm-ivory selection:bg-gold-accent selection:text-white">
        {!shouldHideNavbar && <Navbar />}
        <ToastContainer position="top-center" />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin-portal-secret" element={<AdminLogin />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>

        {!shouldHideNavbar && <Footer />}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
