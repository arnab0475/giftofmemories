import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import AdminLogin from "./pages/AdminLogin";
import DashboardPage from "./pages/DashboardPage";
import FloatingChatButtons from "./components/FloatingChatButtons";
import AnnouncementPopup from "./components/AnnouncementPopup";
import AdminPopups from "./pages/AdminPopups";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/admin-portal-secret",
    "/dashboard",
    "/admin-popups",
  ];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <div className="min-h-screen bg-warm-ivory selection:bg-gold-accent selection:text-white">
        {!shouldHideNavbar && <Navbar />}
        {!shouldHideNavbar && <FloatingChatButtons />}
        {!shouldHideNavbar && <AnnouncementPopup />}
        <ToastContainer position="top-center" />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin-portal-secret" element={<AdminLogin />} />

            {/* Protected Dashboard Route */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin-popups" element={<AdminPopups />} />
            </Route>
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
