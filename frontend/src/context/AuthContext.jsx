import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUserInfo = localStorage.getItem('userInfo');

        if (storedToken && storedUserInfo) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUserInfo));
            } catch (error) {
                console.error("Error parsing stored user info:", error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userInfo');
                setToken(null);
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData, tokenData) => {
        localStorage.setItem('authToken', tokenData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setToken(tokenData);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};