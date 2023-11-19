"use client"
import useTranslation from "@/utils/useTranslation";
import React from "react";

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-white">
            <div className="text-9xl font-bold">404</div>
            <p className="text-xl font-semibold">{t("pageNotFoundTitle")}</p>
            <p className="text-md">{t("pageNotFoundDescription")}</p>
        </div>
    );
}
