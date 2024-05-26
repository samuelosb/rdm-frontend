/**
 * @module AuthContext
 *
 * This module provides an authentication context for managing user authentication state across the application.
 * It includes context creation, a provider component, and a custom hook for accessing the authentication state.
 */

'use client';

import { createContext, useContext, useState } from 'react';

// Create the AuthContext
const AuthContext = createContext();

/**
 * AuthProvider component to wrap the application and provide authentication state.
 *
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The children components that will have access to the authentication state.
 *
 * @returns {JSX.Element} The AuthProvider component wrapping its children with authentication state.
 */
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track if the user is authenticated
    const [isAdmin, setIsAdmin] = useState(false); // State to track if the user has admin privileges
    const [user, setUser] = useState(null); // State to store user information

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to use the AuthContext.
 *
 * @returns {Object} The authentication state and functions to update the state.
 */
export const useAuth = () => useContext(AuthContext);
