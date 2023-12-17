"use client";
import React, { useState } from "react";
import { signIn } from 'next-auth/react';
import AnimatedButton from "@/components/AnimatedButton";
import useTranslation from "@/utils/useTranslation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from 'next/navigation'

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });


    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/')
    }
  };

  // Function to handle Google Sign-In
  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      const result = await signIn('google', { redirect: false });
      if (result?.error) {
        // Handle errors here
        setError(result.error);
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  // Function to handle Facebook Sign-In
  const handleFacebookSignIn = async (): Promise<void> => {
    try {
      const result = await signIn('facebook', { redirect: false });
      if (result?.error) {
        // Handle errors here
        setError(result.error);
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error signing in with Facebook:', error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 h-screen flex justify-center items-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          {t("login")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <AnimatedButton
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:border-green-700 focus:ring-green-500"
            >
              {t("login")}
            </AnimatedButton>
          </div>
          <div>
            <AnimatedButton
              onClick={handleGoogleSignIn}
              disabled={true}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:border-red-700 focus:ring-red-500 opacity-50 cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faGoogle} className="mr-2" />
              {t("signInWithGoogle")}
            </AnimatedButton>
          </div>
          <div>
            <AnimatedButton
              onClick={handleFacebookSignIn}
              disabled={true}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring-blue-500 opacity-50 cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faFacebook} className="mr-2" />
              {t("signInWithFacebook")}
            </AnimatedButton>
          </div>
          {error && (
            <div
              key={error}
              className="transition-opacity duration-500 ease-in-out bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative opacity-0 animate-fade-in"
              role="alert"
            >
              <strong className="font-bold">{t('error')}! </strong>
              <span className="block sm:inline">
                {error === 'CredentialsSignin' ? t('invalidCredentials') : t('errorDescription')}
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
function redirectTo(arg0: string) {
  throw new Error("Function not implemented.");
}

