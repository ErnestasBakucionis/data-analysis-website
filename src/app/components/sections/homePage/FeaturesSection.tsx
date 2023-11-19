"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./FeaturesSection.module.css";
import useTranslation from "@/utils/useTranslation";

function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
        {t("featuresTitle")}
      </h2>
      <div className="flex flex-wrap">
        <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
          <Link href="/services/analysis">
            <div
              className={`bg-white rounded shadow flex flex-col h-full ${styles.hoverCard}`}
            >
              <Image
                src={
                  require(`../../../../images/Advanced_Analytics_Concept.png`)
                    .default
                }
                width={500}
                height={500}
                quality={100}
                alt="Feature One"
                className="h-100 w-full object-cover"
              />
              <div className="p-4 flex-grow">
                <h3 className="text-xl text-gray-800 font-semibold mb-2">
                  {t("featureOneTitle")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("featureOneDescription")}
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
          <Link href="/services/integration">
            <div
              className={`bg-white rounded shadow flex flex-col h-full ${styles.hoverCard}`}
            >
              <Image
                src={
                  require(`../../../../images/Seamless_Integration_Concept.png`)
                    .default
                }
                width={500}
                height={500}
                quality={100}
                alt="Feature Two"
                className="h-100 w-full object-cover"
              />
              <div className="p-4 flex-grow">
                <h3 className="text-xl text-gray-800 font-semibold mb-2">
                  {t("featureTwoTitle")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("featureTwoDescription")}
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
          <Link href="/services/solutions">
            <div
              className={`bg-white rounded shadow flex flex-col h-full ${styles.hoverCard}`}
            >
              <Image
                src={
                  require(`../../../../images/Customizable_Workflows_Concept.png`)
                    .default
                }
                width={500}
                height={500}
                quality={100}
                alt="Feature Three"
                className="h-100 w-full object-cover"
              />
              <div className="p-4 flex-grow">
                <h3 className="text-xl text-gray-800 font-semibold mb-2">
                  {t("featureThreeTitle")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("featureThreeDescription")}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeaturesSection;
