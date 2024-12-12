import React, { createContext, useContext, useEffect, useState } from 'react';

// Định nghĩa kiểu cho context
interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
}

// Tạo context với giá trị mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo provider cho context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Lấy token từ sessionStorage khi khởi tạo
    const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('token')); // State để lưu token

    // Hook effect để cập nhật sessionStorage mỗi khi token thay đổi
    useEffect(() => {
        if (token) {
            sessionStorage.setItem('token', token); // Lưu token vào sessionStorage
        } else {
            sessionStorage.removeItem('token'); // Xóa token khỏi sessionStorage nếu không có token
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook để sử dụng context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};


// import React, { createContext, useContext, useState } from 'react';

// // Định nghĩa kiểu cho context
// interface AuthContextType {
//     token: string | null;
//     setToken: (token: string | null) => void;
// }

// // Tạo context với giá trị mặc định
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Tạo provider cho context
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [token, setToken] = useState<string | null>(null); // State để lưu token

//     return (
//         <AuthContext.Provider value={{ token, setToken }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // Hook để sử dụng context
// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// };
