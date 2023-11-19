"use client";
import React from "react";
import Link from "next/link";
import useTranslation from "@/utils/useTranslation";

const ServicesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        {t("servicesTitle")}
      </h1>
      <div className="flex flex-wrap">
        <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
          <div className="bg-white rounded shadow flex flex-col h-full">
            <div className="p-4 flex-grow">
              <h2 className="text-2xl text-gray-800 font-bold mb-2">
                {t("dataAnalyticsTitle")}
              </h2>
              <p className="text-gray-600 text-sm">
                {t("dataAnalyticsDescription")}
              </p>
              <Link
                href="/services/analysis"
                className="inline-block mt-4 text-green-500 hover:text-green-600"
              >
                {t("learnMore")}
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
          <div className="bg-white rounded shadow flex flex-col h-full">
            <div className="p-4 flex-grow">
              <h2 className="text-2xl text-gray-800 font-bold mb-2">
                {t("dataIntegrationTitle")}
              </h2>
              <p className="text-gray-600 text-sm">
                {t("dataIntegrationDescription")}
              </p>
              <Link
                href="/services/integration"
                className="inline-block mt-4 text-green-500 hover:text-green-600"
              >
                {t("learnMore")}
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
          <div className="bg-white rounded shadow flex flex-col h-full">
            <div className="p-4 flex-grow">
              <h2 className="text-2xl text-gray-800 font-bold mb-2">
                {t("customDataSolutionsTitle")}
              </h2>
              <p className="text-gray-600 text-sm">
                {t("customDataSolutionsDescription")}
              </p>
              <Link
                href="/services/solutions"
                className="inline-block mt-4 text-green-500 hover:text-green-600"
              >
                {t("learnMore")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
