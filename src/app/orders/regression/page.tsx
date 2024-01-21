'use client';
import useTranslation from '@/utils/useTranslation';
import Link from 'next/link';
import React from 'react';

function Regression() {
    const { t } = useTranslation();
    const clientCsvFile = '/sample_data.csv';

    return (
        <div className="container mx-auto p-6 m-4 bg-white rounded-lg shadow-md">
            {/* Information About Regression Analysis */}
            <div>
                <h1 className="text-3xl font-semibold mb-4"> {t('understandingRegressionAnalysis')} </h1>
                <p className="mb-4">
                    {t('understandingRegressionAnalysisExplainingText')}
                </p>
                <hr className="mb-8" />
            </div>

            {/* Performing Regression Analysis with Our Template */}
            <div>
                <h2 className="text-3xl font-semibold mb-4"> {t('simplifyingRegressionAnalysis')} </h2>
                <p className="mb-4">
                    {t('simplifyingRegressionAnalysisExplainingText')} (<Link href="/orders/automatedAnalysis" className="text-blue-600 hover:underline"> {t('learnMore')} </Link>)
                </p>
                <hr className="mb-8" />
            </div>

            {/* Ordering Custom Data Analysis Work */}
            <div>
                <h2 className="text-3xl font-semibold mb-4"> {t('tailoredDataAnalysis')} </h2>
                <p className="mb-4">
                    {t('tailoredDataAnalysisExplainingText')}
                </p>
                <hr className="mb-8" />
            </div>
        </div>
    );
}

export default Regression;
