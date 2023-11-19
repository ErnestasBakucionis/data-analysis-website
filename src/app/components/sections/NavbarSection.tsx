"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "./NavbarSection.module.css";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AnimatedButton from "../AnimatedButton";
import { useLanguage } from "@/utils/LanguageContext";
import useTranslation from "@/utils/useTranslation";

const NavbarSection: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const pathname: string = usePathname();
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const toggleLanguage = () => {
    setIsButtonPressed(true);
    setTimeout(() => setIsButtonPressed(false), 300);

    const newLocale = locale === "en" ? "lt" : "en";
    setLocale(newLocale);
  };

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setIsSticky(scrollPosition > 1);
  };

  const isActive = (href: string): boolean => {
    const active = href === "/" ? pathname === "/" : pathname === href;
    return active;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`bg-gray-800 text-white shadow-lg ${styles.navbar} ${
        isSticky ? styles.navbarSticky : ""
      }`}
    >
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" passHref>
              <span className=" text-green-500 text-xl font-bold md:text-2xl hover:text-white cursor-pointer">
                Dataflow
              </span>
            </Link>
          </div>
          <div className="md:hidden">
            <AnimatedButton
              type="button"
              className="text-gray-200 hover:text-green-500 focus:outline-none focus:text-green-500"
              aria-label="toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path
                  fillRule="evenodd"
                  d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"
                ></path>
              </svg>
            </AnimatedButton>
          </div>
        </div>
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } md:flex items-center`}
        >
          <div className="flex flex-col md:flex-row md:mx-6">
            <Link href="/" passHref>
              <span
                className={`my-1 text-sm md:mx-4 md:my-0 ${
                  isActive("/") ? "text-green-500" : "text-gray-200"
                } hover:text-green-500 cursor-pointer`}
              >
                {t("home")}
              </span>
            </Link>
            <Link href="/services" passHref>
              <span
                className={`my-1 text-sm md:mx-4 md:my-0 ${
                  isActive("/services") ? "text-green-500" : "text-gray-200"
                } hover:text-green-500 cursor-pointer`}
              >
                {t("services")}
              </span>
            </Link>
            <Link href="/about" passHref>
              <span
                className={`my-1 text-sm md:mx-4 md:my-0 ${
                  isActive("/about") ? "text-green-500" : "text-gray-200"
                } hover:text-green-500 cursor-pointer`}
              >
                {t("about")}
              </span>
            </Link>
            <Link href="/contact" passHref>
              <span
                className={`my-1 text-sm md:mx-4 md:my-0 ${
                  isActive("/contact") ? "text-green-500" : "text-gray-200"
                } hover:text-green-500 cursor-pointer`}
              >
                {t("contact")}
              </span>
            </Link>
          </div>
          <div className="flex items-center md:ml-6">
            <Link href="/login" passHref>
              <AnimatedButton
                className={`px-3 py-2 rounded-md text-sm font-medium mr-4 ${
                  isActive("/login")
                    ? "text-gray-200 bg-green-600 hover:bg-gray-700"
                    : "text-gray-200 hover:bg-green-600 bg-gray-700"
                }`}
              >
                {t("login")}
              </AnimatedButton>
            </Link>
            <Link href="/register" passHref>
              <AnimatedButton
                className={`px-3 py-2 rounded-md text-sm font-medium mr-4 ${
                  isActive("/register")
                    ? "text-gray-200 bg-green-600 hover:bg-gray-700"
                    : "text-gray-200 hover:bg-green-600 bg-gray-700"
                }`}
              >
                {t("register")}
              </AnimatedButton>
            </Link>
            <button
              onClick={toggleLanguage}
              className={`focus:outline-none mx-2 ${styles.buttonTransition} ${
                isButtonPressed ? styles.buttonPressed : ""
              }`}
            >
              {locale === "en" ? (
                <Image
                  src={require(`../../../images/flags/LithuanianFlag.png`)}
                  alt="Lithuanian Flag"
                  width={40}
                  height={40}
                />
              ) : (
                <Image
                  src={require(`../../../images/flags/UnitedKingdomFlag.png`)}
                  alt="English Flag"
                  width={40}
                  height={40}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarSection;
