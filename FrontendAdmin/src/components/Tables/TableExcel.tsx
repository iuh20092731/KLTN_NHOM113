import { useState } from 'react';
import { Package } from '../../types/package';
import { advertisement } from '../../types/adventisement';


interface TableExcelProps {
    initialData: { code: number; result: advertisement[] };
}

const initialPackageData: Package[] = [
    {
        name: 'Free package',
        price: 0.0,
        invoiceDate: 'Jan 13, 2023',
        status: 'Paid',
    },
    {
        name: 'Standard Package',
        price: 59.0,
        invoiceDate: 'Jan 13, 2023',
        status: 'Paid',
    },
    {
        name: 'Business Package',
        price: 99.0,
        invoiceDate: 'Jan 13, 2023',
        status: 'Unpaid',
    },
    {
        name: 'Standard Package',
        price: 59.0,
        invoiceDate: 'Jan 13, 2023',
        status: 'Pending',
    },
];

// interface TableExcelProps {
//     initialData: Package[]; // Định nghĩa kiểu cho props
// }

const TableExcel = ({ initialData }: TableExcelProps) => {
    const [advertisements, setAdvertisements] = useState<advertisement[]>(initialData.result);
    const [packageData, setPackageData] = useState<Package[]>(initialPackageData);
    const [newInputData, setNewInputData] = useState<Package[]>(Array(10).fill({ name: '', price: 0.0, invoiceDate: '', status: 'A' })); // Mảng mới với 10 dòng rỗng

    // const handleInputChange = (
    //     e: React.ChangeEvent<HTMLInputElement>,
    //     index: number,
    //     field: keyof Package
    // ) => {
    //     const value = field === 'price' ? parseFloat(e.target.value) : e.target.value;

    //     // Cập nhật giá trị trong packageData hoặc newInputData
    //     if (index < packageData.length) {
    //         // Nếu là dòng cũ, thay đổi trạng thái thành 'U'
    //         setPackageData((prevData) =>
    //             prevData.map((pkg, i) =>
    //                 i === index ? { ...pkg, [field]: value, status: 'U' } : pkg
    //             )
    //         );
    //     } else {
    //         // Nếu là dòng mới
    //         const newIndex = index - packageData.length; // Chỉ số trong newInputData
    //         setNewInputData((prevNewData) =>
    //             prevNewData.map((pkg, i) =>
    //                 i === newIndex ? { ...pkg, [field]: value } : pkg
    //             )
    //         );
    //     }
    // };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
        field: keyof Package | keyof advertisement
    ) => {
        const value = field === 'price' ? parseFloat(e.target.value) : e.target.value;

        // Check if the index belongs to the package data
        if (index < packageData.length) {
            // Update package data and set status to 'U'
            setPackageData((prevData) =>
                prevData.map((pkg, i) =>
                    i === index ? { ...pkg, [field]: value, status: 'U' } : pkg
                )
            );
        } else if (index < packageData.length + newInputData.length) {
            // If it's in newInputData
            const newIndex = index - packageData.length; // Adjust index for newInputData
            setNewInputData((prevNewData) =>
                prevNewData.map((pkg, i) =>
                    i === newIndex ? { ...pkg, [field]: value } : pkg
                )
            );
        } else {
            // If it's in advertisements
            const adIndex = index - (packageData.length + newInputData.length); // Adjust index for advertisements
            setAdvertisements((prevAds) =>
                prevAds.map((ad, i) =>
                    i === adIndex ? { ...ad, [field]: value, status: 'U' } : ad
                )
            );
        }
    };



    const handleSaveData = () => {
        // Logic để gọi BE và lưu dữ liệu
        const allDataToSave = [...packageData, ...newInputData]; // Lưu cả dữ liệu cũ và mới
        console.log('Data to save:', allDataToSave);
    };

    console.log('initialData:', initialData);

    // Dynamically generate headers based on initialData keys
    const columnNames = Object.keys(advertisements[0]);
    console.log('Headers:', columnNames);

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-left dark:bg-meta-4">
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white border border-gray-300">Status</th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white border border-gray-300">Package Name</th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white border border-gray-300">Price</th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white border border-gray-300">Invoice Date</th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white border border-gray-300">Actions</th>
                        </tr>
                        <tr className="bg-gray-200 text-left dark:bg-meta-4">
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white border border-gray-300">Status</th>
                            {columnNames.map((header) => (
                                <th key={header} className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white border border-gray-300">
                                    {header.charAt(0).toUpperCase() + header.slice(1)} 
                                </th>
                            ))}
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...packageData, ...newInputData].map((packageItem, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 py-5 px-4 dark:border-strokedark">
                                    <input
                                        type="text"
                                        value={packageItem.status}
                                        readOnly
                                        className="w-full px-2 py-1 border rounded bg-gray-100"
                                    />
                                </td>
                                <td className="border border-gray-300 py-5 px-4 dark:border-strokedark">
                                    <input
                                        type="text"
                                        value={packageItem.name}
                                        onChange={(e) => handleInputChange(e, index, 'name')}
                                        className="w-full px-2 py-1 border rounded"
                                        placeholder="Enter package name"
                                    />
                                </td>
                                <td className="border border-gray-300 py-5 px-4 dark:border-strokedark">
                                    <input
                                        type="number"
                                        value={packageItem.price}
                                        onChange={(e) => handleInputChange(e, index, 'price')}
                                        className="w-full px-2 py-1 border rounded"
                                        placeholder="Enter price"
                                    />
                                </td>
                                <td className="border border-gray-300 py-5 px-4 dark:border-strokedark">
                                    <input
                                        type="text"
                                        value={packageItem.invoiceDate}
                                        onChange={(e) => handleInputChange(e, index, 'invoiceDate')}
                                        className="w-full px-2 py-1 border rounded"
                                        placeholder="Enter invoice date"
                                    />
                                </td>
                                <td className="border border-gray-300 py-5 px-4 dark:border-strokedark">
                                    <button
                                        onClick={handleSaveData}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Save
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {advertisements.map((ad, adIndex) => (
                            <tr key={ad.id}> {/* Sử dụng id duy nhất nếu có */}
                                <td className="border border-gray-300 py-5 px-4 dark:border-strokedark">
                                    <input
                                        type="text"
                                        value={ad.status}
                                        onChange={(e) => {
                                            const newStatus = e.target.value;
                                            setAdvertisements((prevAds) =>
                                                prevAds.map((advertisement, index) =>
                                                    index === adIndex ? { ...advertisement, status: newStatus } : advertisement
                                                )
                                            );
                                        }}
                                        className="w-full px-2 py-1 border rounded"
                                        placeholder="Enter status"
                                    />
                                </td>
                                {columnNames.map((header) => (
                                    <td key={header} className="border border-gray-300 py-5 px-4 dark:border-strokedark">
                                        <input
                                            type="text"
                                            value={ad[header]}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setAdvertisements((prevAds) =>
                                                    prevAds.map((advertisement, index) =>
                                                        index === adIndex ? { ...advertisement, [header]: newValue } : advertisement
                                                    )
                                                );
                                            }}
                                            className="w-full px-2 py-1 border rounded"
                                            placeholder={`Enter ${header}`}
                                        />
                                    </td>
                                ))}
                                <td className="border border-gray-300 py-5 px-4 dark:border-strokedark">
                                    <button onClick={handleSaveData} className="text-blue-500 hover:underline">
                                        Save
                                    </button>
                                </td>
                            </tr>
                        ))}


                    </tbody>
                </table>
            </div>
            <button onClick={handleSaveData} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Save All Data</button>
        </div>
    );
};

export default TableExcel;
