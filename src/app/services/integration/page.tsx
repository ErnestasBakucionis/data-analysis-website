"use client";
import React from "react";
import useTranslation from "@/utils/useTranslation";

const DataIntegrationPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        {t("dataIntegrationTitle")}
      </h1>
      <div className="flex justify-center">
        <div className="w-full lg:w-2/3">
          <p className="mt-4 text-gray-600 text-lg">
            {t("dataIntegrationDescription-2")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataIntegrationPage;
