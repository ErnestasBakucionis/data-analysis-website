'use client';
import React from 'react';
import Image from "next/image";
import useTranslation from '@/utils/useTranslation';

function Regression() {
    const { t } = useTranslation();
    const clientCsvFile = '/sample_data.csv';

    return (
        <div className="container mx-auto p-6">
            <div className='mx-auto p-6 m-4 bg-white rounded-lg shadow-md'>

                <h1 className="text-2xl font-semibold mb-4">{t('whatOurTemplateConsistOf')}</h1>
                <h2 className="text-xl font-semibold mb-4">{t('simpleCsvDataTemplate')}</h2>
                <p className="mb-4">
                    {t('simpleCsvDataTemplateExplainingText-1')}
                    <i> {t('simpleCsvDataTemplateExplainingText-2')} </i>
                    {t('simpleCsvDataTemplateExplainingText-3')}
                </p>

                <p>
                    {/* Bullet point list */}
                    <ul className='list-decimal px-10'>
                        <li>
                            <b>ID</b>: {t('idDescription')} ({t('dataType')}: <b>{t('integer')}</b>)
                        </li>
                        <li>
                            <b>Country</b>: {t('countryDescription')} ({t('dataType')}: <b>{t('string')}</b>)
                        </li>
                        <li>
                            <b>City</b>: {t('cityDescription')} ({t('dataType')}: <b>{t('string')}</b>)
                        </li>
                        <li>
                            <b>Order Date</b>: {t('orderDateDescription')} ({t('dataType')}: <b>{t('date')}</b> <b>{t('dateFormat')}: YYYY-MM-DD</b>)
                        </li>
                        <li>
                            <b>Product Name</b>: {t('productNameDescription')} ({t('dataType')}: <b>{t('string')}</b>)
                        </li>
                        <li>
                            <b>Unit Price</b>: {t('unitPriceDescription')} ({t('dataType')}: <b>{t('float')}</b>)
                        </li>
                        <li>
                            <b>Quantity</b>: {t('quantityDescription')} ({t('dataType')}: <b>{t('integer')}</b>)
                        </li>
                        <li>
                            <b>Total Price</b>: {t('totalPriceDescription')} ({t('dataType')}: <b>{t('float')}</b>)
                        </li>
                        <li>
                            <b>Category Name</b>: {t('categoryNameDescription')} ({t('dataType')}: <b>{t('string')}</b>)
                        </li>
                        <li>
                            <b>Weekday</b>: {t('weekdayDescription')} ({t('dataType')}: <b>{t('string')}</b>)
                        </li>
                        <li>
                            <b>Public Holiday</b>: {t('publicHolidayDescription')} ({t('dataType')}: <b>{t('boolean')}</b>)
                        </li>
                        <li>
                            <b>Season</b>: {t('seasonDescription')} ({t('dataType')}: <b>{t('string')}</b>)
                        </li>
                        <li>
                            <b>Month</b>: {t('monthDescription')} ({t('dataType')}: <b>{t('integer')}</b>)
                        </li>
                        <li>
                            <b>Year</b>: {t('yearDescription')} ({t('dataType')}: <b>{t('integer')}</b>)
                        </li>
                        <li>
                            <b>Price Change Indicator</b>: {t('priceChangeIndicatorDescription')} ({t('dataType')}: <b>{t('boolean')}</b>)
                        </li>
                        <li>
                            <b>7-day Moving Average</b>: {t('7-dayMovingAverageDescription')} ({t('dataType')}: <b>{t('float')}</b>)
                        </li>
                        <li>
                            <b>Category Seasonality Index</b>: {t('categorySeasonalityIndexDescription')} ({t('dataType')}: <b>{t('float')}</b>)
                        </li>
                        <li>
                            <b>Competitor Pricing</b>: {t('competitorPricingDescription')} ({t('dataType')}: <b>{t('float')}</b>)
                        </li>
                        <li>
                            <b>Marketing Spend</b>: {t('marketingSpendDescription')} ({t('dataType')}: <b>{t('float')}</b>)
                        </li>
                        <li>
                            <b>Customer Average Rating</b>: {t('customerAverageRatingDescription')} ({t('dataType')}: <b>{t('float')}</b>)
                        </li>
                        <li>
                            <b>Inventory Level</b>: {t('inventoryLevelDescription')} ({t('dataType')}: <b>{t('integer')}</b>)
                        </li>
                        <li>
                            <b>Online Search Trend</b>: {t('onlineSearchTrendDescription')} ({t('dataType')}: <b>{t('float')}</b>)
                        </li>
                    </ul>
                </p>

                <br></br>

                <h3 className="text-xl font-semibold mb-4">{t('examplesOfSimpleDataTemplate')}</h3>
                <p className="mb-4">
                    {t('examplesOfSimspleDataTemplateExplainingText')}<b>Excel</b>.
                </p>

                <Image
                    src={
                        require(`../../../images/Simple_Data_Template_Example.png`)
                            .default
                    }
                    width={10000}
                    height={10000}
                    quality={100}
                    alt="Feature Three"
                    className="h-100 w-full object-cover"
                />
                <br></br>

                <p>
                    {t('examplesOfSimpleDataTemplateExplainingText-2')} <b>CSV</b> {t('examplesOfSimpleDataTemplateExplainingText-3')}
                    <a href={clientCsvFile} download className="text-blue-600 hover:underline">
                        <b> {t('downloadSimpleDataTemplateExample')}</b>
                    </a>
                </p>
                <br></br>
                <hr className="mb-8" />

            </div>
        </div>
    );
}

export default Regression;
