"use client";
import useTranslation from "@/utils/useTranslation";
import React from "react";

export default function Error() {
    const { t } = useTranslation();

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-white">
            <div className="text-6xl font-bold text-red-600">{t("error")}</div>
            <p className="text-xl font-semibold">{t("errorTitle")}</p>
            <p className="text-md">{t("errorDescription")}</p>
        </div>
    );
}
