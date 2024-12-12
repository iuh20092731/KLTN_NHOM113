import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff, Mail, Phone, X } from "lucide-react";
import { RegisterCredentials, RegisterCredentialsSchema } from "@/types/Auth";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { register } from '@/redux/thunks/auth';
import { FormInput } from '@/components/common/FormInput';
import { getDeviceInfo } from "@/utils/getInfoDevice";

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterCredentials & { confirmPassword: string }>({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    userType: "USER",
    deviceInfo: getDeviceInfo()
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "fullName") {
      const [firstName, ...lastNameParts] = value.split(" ");
      setFormData(prev => ({
        ...prev,
        firstName: firstName || "",
        lastName: lastNameParts.join(" ") || ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value === "" ? undefined : value }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        description: "Mật khẩu và xác nhận mật khẩu không khớp.",
      });
      return;
    }
  
    try {
      const dataToSubmit = {
        ...formData,
        username: formData.email,
      };
      RegisterCredentialsSchema.parse(dataToSubmit);
      
      const resultAction = await dispatch(register(dataToSubmit));
      if (register.fulfilled.match(resultAction)) {
        toast({ description: "Đăng ký thành công. Vui lòng xác thực OTP." });
        
        // Chuyển hướng sang trang OTP, truyền email hoặc số điện thoại
        navigate("/otp-verification", { state: { email: formData.email } });
        
      } else {
        toast({
          variant: "destructive",
          description: resultAction.payload as string || "Đăng ký thất bại. Vui lòng thử lại.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        description: err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <Card className="w-full max-w-4xl shadow-2xl relative">
        <Link
          to="/"
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition-transform duration-300 hover:rotate-180"
        >
          <X className="h-6 w-6 text-gray-600" />
        </Link>
      
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-3xl text-center font-bold text-gray-800">Đăng ký</CardTitle>
          <CardDescription className="text-center text-gray-600 pt-2">
            Tạo tài khoản mới để sử dụng dịch vụ của chúng tôi
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              required
              icon={<Mail className="h-5 w-5" />}
            />
          
          <FormInput
              id="phoneNumber"
              name="phoneNumber"
              label="Số điện thoại"
              type="tel"
              placeholder="Nhập số điện thoại"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              icon={<Phone className="h-5 w-5" />}
            />
            <FormInput
              id="password"
              name="password"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
              icon={<Lock className="h-5 w-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} className="" /> : <Eye size={20} />}
                </button>
              }
            />
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              icon={<Lock className="h-5 w-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
            <FormInput
              id="fullName"
              name="fullName"
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              value={`${formData.firstName} ${formData.lastName}`.trim()}
              onChange={handleChange}
              required
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition duration-300 ease-in-out" 
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
            <div className="text-center">
              <Link to="/login" className="text-sm text-green-500 hover:underline">
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}