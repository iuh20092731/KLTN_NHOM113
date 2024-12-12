// src/components/ExcelSheet.tsx
import React from 'react';

interface Advertisement {
    advertisementId: number;
    mainAdvertisementName: string;
    serviceId: number;
    serviceName: string;
    adStartDate: string;
    adEndDate: string;
    clicks: number;
    likes: number;
    views: number;
    saved: number;
    shared: number;
    distance: number;
    adStatus: string;
    description: string | null;
    address: string;
    phoneNumber: string;
    priceRangeLow: number;
    priceRangeHigh: number;
    openingHourStart: string;
    openingHourEnd: string;
}

const ExcelSheet: React.FC<{ data: Advertisement[] }> = ({ data }) => {
    return (
        <div className="overflow-auto">
            <table className="min-w-full border">
                <thead>
                    <tr>
                        {data.length > 0 && Object.keys(data[0]).map((key) => (
                            <th key={key} className="px-4 py-2 border">{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {Object.values(row).map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-2 border">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExcelSheet;
