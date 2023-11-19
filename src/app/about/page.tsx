"use client";
import React from "react";
import useTranslation from "@/utils/useTranslation";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="container mx-auto px-6 py-3">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {t("aboutTitle")}
        </h1>

        <div className="bg-white shadow-lg rounded-lg px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-3">
            {t("whoWeAreTitle")}
          </h2>
          <p className="text-gray-600">{t("whoWeAreText")}</p>
        </div>

        <div className="mt-6 bg-white shadow-lg rounded-lg px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-3">
            {t("ourVisionTitle")}
          </h2>
          <p className="text-gray-600">{t("ourVisionText")}</p>
        </div>

        <div className="mt-6 bg-white shadow-lg rounded-lg px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-3">
            {t("ourTeamTitle")}
          </h2>
          <p className="text-gray-600">{t("ourTeamText")}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
