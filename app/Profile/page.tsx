"use client";
import React, { useState, useEffect } from 'react';
import ManageUser from "@/database/auth/ManageUser";

const Profile = () => {
    const { user, loading } = useAuth(); // Fetch the user object from Firebase authentication context
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        newPassword: '',
        confirmNewPassword: '',
        allergies: ''
    });

    useEffect(() => {
        if (user) {
            // Populate form data with user profile data
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                allergies: user.allergies ? user.allergies.join(', ') : ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Update user profile data in Firestore
        updateUserProfile(user.uid, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            allergies: formData.allergies.split(',').map(item => item.trim())
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full sm:w-2/3 lg:w-1/2 px-6 py-4 bg-white shadow-md rounded-lg">
                <h1 className="text-xl font-semibold mb-4">User Profile</h1>
                <form onSubmit={handleSubmit}>
                    {/* Your form fields here */}
                </form>
            </div>
        </div>
    );
};

export default Profile;
