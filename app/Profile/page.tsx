"use client";
import React, { useState } from 'react';

const Profile = () => {
    const [user, setUser] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        allergies: ['Nuts']
    });

    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
        newPassword: '',
        confirmNewPassword: '',
        allergies: user.allergies.join(', ')
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUser = {
            ...user,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            allergies: formData.allergies.split(',').map(item => item.trim())
        };
        setUser(updatedUser);
        setFormData({ ...formData, password: '', newPassword: '', confirmNewPassword: '' });
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full sm:w-2/3 lg:w-1/2 px-6 py-4 bg-white shadow-md rounded-lg">
                <h1 className="text-xl font-semibold mb-4">User Profile</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name:</label>
                        <input type="text" name="firstName" id="firstName" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name:</label>
                        <input type="text" name="lastName" id="lastName" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email:</label>
                        <input type="email" name="email" id="email" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password:</label>
                        <input type="password" name="password" id="password" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">New Password:</label>
                        <input type="password" name="newPassword" id="newPassword" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={formData.newPassword} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmNewPassword">Confirm New Password:</label>
                        <input type="password" name="confirmNewPassword" id="confirmNewPassword" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={formData.confirmNewPassword} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allergies">Food Allergies:</label>
                        <input type="text" name="allergies" id="allergies" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={formData.allergies} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Update Profile</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
