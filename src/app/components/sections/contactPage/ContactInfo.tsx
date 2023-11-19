"use client";
import React from "react";
import useTranslation from "@/utils/useTranslation";

const ContactInfo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-center md:text-left">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {t("contactInfoTitle")}
      </h2>
      <p className="mb-4 text-gray-600">{t("contactDescription")}</p>
      <div className="mb-4">
        <span className="font-bold text-gray-700">{t("emailLabel")}:</span>{" "}
        <a
          href="mailto:ernestas.bak199@go.kauko.lt"
          className="text-green-500 hover:text-green-600"
        >
          ernestas.bak199@go.kauko.lt
        </a>
      </div>
      <div className="mb-4">
        <span className="font-bold text-gray-700">{t("phoneLabel")}:</span>{" "}
        <a
          href="tel:+37061301589"
          className="text-green-500 hover:text-green-600"
        >
          +370 832 01589
        </a>
      </div>
      <div>
        <span className="font-bold text-gray-700">{t("addressLabel")}:</span>{" "}
        <p className="text-gray-600">
          Lithuania, V. Krevės pr. 90, 50386, Kaunas
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;
