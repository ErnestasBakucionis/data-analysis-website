"use client";
import Link from "next/link";
import React from "react";
import AnimatedButton from "../../AnimatedButton";
import useTranslation from "@/utils/useTranslation";
import { useSession } from "next-auth/react";

function BannerSection() {
  const { t } = useTranslation();
  const { data } = useSession();
  const isUserAdmin = data?.user?.role === 'admin';
  const isUserDefault = data?.user?.role === 'user';
  const isUserWorker = data?.user?.role === 'worker';

  let linkPath = "/register";
  if (isUserAdmin) {
    linkPath = "/administration/users";
  } else if (isUserDefault || isUserWorker) {
    linkPath = "/orders/myorders";
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          {t("bannerTitle")}
        </h2>
        <h3 className="text-2xl mb-8 text-gray-600">{t("bannerSubtitle")}</h3>
        <Link href={linkPath}>
          <AnimatedButton className="bg-gray-800 hover:bg-green-600 text-white px-4 py-2 rounded">
            {t("getStarted")}
          </AnimatedButton>
        </Link>
      </div>
    </div>
  );
}

export default BannerSection;
