'use client'
import useTranslation from "@/utils/useTranslation";
import React from "react";

export default function NotAuthorized() {
    const { t } = useTranslation();
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-white">
            <div className="text-6xl font-bold text-red-600">{t("notAuthorized")}</div>
            <p className="text-xl font-semibold">{t("notAuthorizedDescription")}</p>
            < p className="text-md">{t("notAuthorizedDescription-2")}</p>
        </div>
    );
}
