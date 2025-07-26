import React, { useEffect } from "react";

import Navbar from "./components/Navbar.jsx";

import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
// page imports
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/HomePage.jsx";

const App = () => {
    const { authUser, checkAuth, isCheckingAuth} = useAuthStore();
    const { theme } = useThemeStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // SETTING THEME
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [ theme]);

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={authUser ? <HomePage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/signup"
                    element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
                />
                <Route
                    path="/login"
                    element={!authUser ? <LogInPage /> : <Navigate to="/" />}
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route
                    path="/profile"
                    element={
                        authUser ? <ProfilePage /> : <Navigate to="/login" />
                    }
                />
            </Routes>

            <Toaster position="top-center" reverseOrder={true} />
        </div>
    );
};

export default App;
