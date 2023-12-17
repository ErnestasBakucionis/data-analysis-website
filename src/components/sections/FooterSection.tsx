"use client";
import useTranslation from "@/utils/useTranslation";
import React from "react";

function FooterSection() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col items-center">
          <div className="py-6">
            <p className="text-gray-400 text-sm text-center">
              © 2023 DataFlow. {t("allRightsReserved")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
