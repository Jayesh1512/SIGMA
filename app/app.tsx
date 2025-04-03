'use client'
import { useState } from 'react';

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium">Email</label>
            <input id="email" type="email" required className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium">Password</label>
            <input id="password" type="password" required className="w-full p-2 border rounded-md" />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="confirm-password" className="block font-medium">Confirm Password</label>
              <input id="confirm-password" type="password" required className="w-full p-2 border rounded-md" />
            </div>
          )}
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded-md">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <button onClick={toggleForm} className="w-full text-blue-600">
          {isLogin ? "Create an account" : "Already have an account?"}
        </button>
      </div>
    </div>
  );
}
