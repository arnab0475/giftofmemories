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
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import AboutPage from "./pages/AboutPage";
import AdminLogin from "./pages/AdminLogin";
import ProductsPage from "./pages/ProductsPage";
import DashboardPage from "./pages/DashboardPage";
import AdminEnquiry from "./pages/AdminEnquiry";
import AdminEnquiryDetails from "./pages/AdminEnquiryDetails";
import FloatingChatButtons from "./components/FloatingChatButtons";
import AnnouncementPopup from "./components/AnnouncementPopup";
import AdminPopups from "./pages/AdminPopups";
import AdminBlogPage from "./pages/AdminBlogPage";
import AdminTestimonial from "./pages/AdminTestimonial";
import AdminServicePage from "./pages/AdminServicePage";
import AdminHero from "./pages/AdminHero";
import AdminGalleryPage from "./pages/AdminGalleryPage";
import AdminShopPage from "./pages/AdminShopPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import { ClientAuthProvider } from "./context/ClientAuthContext";
import ClientLoginPage from "./pages/ClientLoginPage";
import ClientSignupPage from "./pages/ClientSignupPage";

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
    "/admin-blogs",
    "/admin-enquiries",
    "/admin-testimonials",
    "/admin-services",
    "/admin-hero",
    "/admin-gallery",
    "/admin-shop",
    "/admin-users",
  ];
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ClientAuthProvider>
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
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin-portal-secret" element={<AdminLogin />} />
              <Route path="/shop" element={<ProductsPage />} />
              <Route path="/login" element={<ClientLoginPage />} />
              <Route path="/signup" element={<ClientSignupPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admin-popups" element={<AdminPopups />} />
                <Route path="/admin-blogs" element={<AdminBlogPage />} />
                <Route path="/admin-enquiries" element={<AdminEnquiry />} />
                <Route
                  path="/admin-enquiries/:id"
                  element={<AdminEnquiryDetails />}
                />
                <Route
                  path="/admin-testimonials"
                  element={<AdminTestimonial />}
                />
                <Route path="/admin-services" element={<AdminServicePage />} />
                <Route path="/admin-hero" element={<AdminHero />} />
                <Route path="/admin-gallery" element={<AdminGalleryPage />} />
                <Route path="/admin-shop" element={<AdminShopPage />} />
                <Route path="/admin-users" element={<AdminUsersPage />} />
              </Route>
            </Routes>
          </main>
          {!shouldHideNavbar && <Footer />}
        </div>
      </ClientAuthProvider>
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
