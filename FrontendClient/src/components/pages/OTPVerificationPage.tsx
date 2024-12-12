import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { resendOtp, verifyOtp } from "@/redux/thunks/auth";
import { useToast } from "@/hooks/use-toast";

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendOtpTime, setResendOtpTime] = useState(30);

  useEffect(() => {
    if (resendOtpTime > 0) {
      const timer = setTimeout(() => setResendOtpTime(resendOtpTime - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendOtpTime]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast({
        variant: "destructive",
        description: "Vui lòng nhập mã OTP.",
      });
      return;
    }

    setLoading(true);

    try {
      const resultAction = await dispatch(verifyOtp({ email, otp }));

      if (verifyOtp.fulfilled.match(resultAction)) {
        toast({
          description: "Xác thực OTP thành công!",
        });
        navigate("/login");
      } else {
        toast({
          variant: "destructive",
          description: resultAction.payload as string || "Xác thực OTP thất bại.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendOtpTime === 0) {
      dispatch(resendOtp(email));
      toast({
        description: "OTP đã được gửi lại.",
      });
      setResendOtpTime(30);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-700">Xác thực OTP</h1>
        <p className="text-center text-gray-500">Mã OTP đã được gửi đến: <span className="font-semibold">{email}</span></p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={handleOtpChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring focus:ring-green-200"
            required
          />
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} transition duration-300`}
            disabled={loading}
          >
            {loading ? "Đang xác thực..." : "Xác thực"}
          </button>
        </form>

        <div className="text-center">
          {resendOtpTime > 0 ? (
            <p className="text-gray-400">Gửi lại OTP sau {resendOtpTime} giây</p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-green-500 hover:text-green-600 font-semibold transition duration-300"
            >
              Gửi lại OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}