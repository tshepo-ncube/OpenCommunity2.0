'use client'
import React from 'react';
import Background from '../../_Components/Background';

const LandingPage = () => {
  return (
    <Background>
        <Background>
            <Background>
                <Background>
                <div className="flex h-screen items-center justify-center flex-col space-y-10">
                    <div className="relative text-center">
                        <h2 className="text-6xl font-bold">
                            <span className="text-gray-700">open </span>
                            <span
                                className="text-white bg-green-400 px-2 py-1 rounded-tl-md rounded-tr-md rounded-bl-3xl rounded-br-md"
                                style={{ backgroundColor: '#bcd727' }}
                            >
                                community
                            </span>
                        </h2>
                        <p className="mt-4 text-gray-600 text-2xl">Connect. Collaborate. Create.</p>
                    </div>
                    
                    <div className="text-center">
                        <form className="flex items-center space-x-4">
                            <div className="flex flex-col text-left">
                                <label htmlFor="email" className="text-gray-700">
                                Email
                                </label>
                                <input
                                type="email"
                                id="email"
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Enter your email"
                                required
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <label htmlFor="password" className="text-gray-700">
                                Password
                                </label>
                                <input
                                type="password"
                                id="password"
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Enter your password"
                                required
                                />
                            </div>
                        </form>
                        <button
                        type="submit"
                        className="w-full py-3 text-white rounded-md font-bold transition-colors mt-4"
                        style={{ backgroundColor: '#bcd727' }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#8ba014')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#bcd727')}
                        >
                        Log In
                        </button>
                        <div className="text-left mb-4 mt-1">
                            <a href="/forgot-password" className="text-sm" style={{ color: '#465301' }}>
                                Forgot Password?
                            </a>
                        </div>
                    </div>
                </div>

                </Background>
            </Background>
        </Background>
    </Background>
  );
};

export default LandingPage;