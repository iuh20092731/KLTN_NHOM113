import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Column<T> {
    title: string; // Tên cột
    dataIndex: keyof T; // Tên thuộc tính tương ứng trong dữ liệu
}

interface DataTableProps<T> {
    title: string;
    data: T[]; // Sử dụng kiểu dữ liệu tổng quát
    columns: Column<T>[]; // Prop cho tên cột
    path: string; // Prop cho đường dẫn chuyển hướng
    actionButton?: (item: T) => JSX.Element;
}

const DataTable = <T,>({ title, data, columns, path, actionButton }: DataTableProps<T>) => {
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const navigate = useNavigate(); // Hook điều hướng

    const handleRowClick = (item: T) => {
        setSelectedItem(item);
    };

    const handleRowDoubleClick = (item: T) => {
        // Chuyển hướng tới trang tạo với dữ liệu item đã chọn
        navigate(`${path}?item=${encodeURIComponent(JSON.stringify(item))}`);
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                {title}
            </h4>

            {/* Nút Create */}
            <div className="mb-4">
                <button
                    onClick={() => navigate(path)} // Sử dụng path truyền vào
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Create
                </button>
            </div>

            <div className="overflow-x-auto pb-10">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-2 dark:bg-meta-4">
                            <th className="p-2.5 text-center border-b border-stroke dark:border-strokedark">
                                <h5 className="text-sm font-medium uppercase xsm:text-base">
                                    Func
                                </h5>
                            </th>
                            {columns.map((column, index) => (
                                <th className="p-2.5 text-center border-b border-stroke dark:border-strokedark" key={index}>
                                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                                        {column.title}
                                    </h5>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, key) => (
                            <tr
                                className={`border-b border-stroke dark:border-strokedark ${key === data.length - 1 ? 'border-b-0' : ''}`}
                                key={key}
                                onClick={() => handleRowClick(item)} // Thêm sự kiện nhấp chuột
                                onDoubleClick={() => handleRowDoubleClick(item)} // Thêm sự kiện nhấp đúp
                            >
                                {actionButton && (
                                    <td className="p-2.5 text-center border-b border-stroke dark:border-strokedark">
                                        {actionButton(item)} {/* Render nút hành động */}
                                    </td>
                                )}
                                {columns.map((column, index) => (
                                    <td
                                        className="p-2.5 text-center border-b border-stroke dark:border-strokedark"
                                        key={index}
                                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    >
                                        <p className={column.title === 'Revenues' ? 'text-meta-3' : 'text-black dark:text-white'}>
                                            {item[column.dataIndex]} {/* Truy cập thuộc tính dựa trên tên cột */}
                                        </p>
                                    </td>
                                ))}
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
