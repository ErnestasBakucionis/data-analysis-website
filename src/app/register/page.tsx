"use client";
import React, { useState } from "react";
import AnimatedButton from "@/components/AnimatedButton";
import useTranslation from "@/utils/useTranslation";
import { signIn } from 'next-auth/react';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError(t("passwordsMustMatch"));
      return false;
    }

    if (!email.includes('@')) {
      setError(t("invalidEmail"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        surname: surname,
        email: email,
        password: password,
        confirmPassword: confirmPassword
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(t(result.error) || result.error);
      } else {
        window.location.href = '/';
      }
    } else {
      setError(t(responseData.message) || responseData.message);
    }
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
              htmlFor="name"
              className="text-sm font-medium text-gray-700"
            >
              {t("name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="surname" className="text-sm font-medium text-gray-700">
              {t("surname")}
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
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
          {error && (
            <div
              className="transition-opacity duration-500 ease-in-out bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative opacity-0 animate-fade-in"
              role="alert"
            >
              <strong className="font-bold">{t('error')}! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
