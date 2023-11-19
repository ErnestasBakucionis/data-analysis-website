"use client";
import React, { useState } from "react";
import AnimatedButton from "../components/AnimatedButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import useTranslation from "@/utils/useTranslation";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register:", username, email, password, confirmPassword);
  };

  // Function to handle Google Sign-In
  const handleGoogleSignIn = (): void => {
    // signInWithGoogle()
    //   .then(user => {
    //     console.log('Signed in with Google:', user);
    //   })
    //   .catch(error => {
    //     console.error('Error signing in with Google:', error);
    //   });
  };

  // Function to handle Facebook Sign-In
  const handleFacebookSignIn = (): void => {
    // signInWithFacebook()
    //   .then(user => {
    //     console.log('Signed in with Facebook:', user);
    //   })
    //   .catch(error => {
    //     console.error('Error signing in with Facebook:', error);
    //   });
  };

  return (
    <div className="container mx-auto px-6 py-12 h-screen flex justify-center items-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          {t("register")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              {t("username")}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              {t("password")}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              {t("confirmPassword")}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div>
            <AnimatedButton
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:border-green-700 focus:ring-green-500"
            >
              {t("register")}
            </AnimatedButton>
          </div>
          <div>
            <AnimatedButton
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:border-red-700 focus:ring-red-500"
            >
              <FontAwesomeIcon icon={faGoogle} className="mr-2" />
              {t("signInWithGoogle")}
            </AnimatedButton>
          </div>
          <div>
            <AnimatedButton
              onClick={handleFacebookSignIn}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring-blue-500"
            >
              <FontAwesomeIcon icon={faFacebook} className="mr-2" />
              {t("signInWithFacebook")}
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
