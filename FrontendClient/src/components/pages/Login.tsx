import { FormInput } from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AppDispatch, RootState } from "@/redux/store";
import { login, loginWithFacebook, loginWithGoogle } from "@/redux/thunks/auth";
import { getUserInfo } from "@/redux/thunks/user";
import { Credentials, CredentialsSchema } from "@/types/Auth";
import { Lock, Mail, Megaphone, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { LoginSocialFacebook } from "reactjs-social-login";
// import { CustomSuccessToast } from "../common/CustomSuccessToast";

export default function LoginPage() {
  const [formData, setFormData] = useState<Credentials>({
    username: "",
    password: "",
  });
  const [showPassword] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const redirectUrl = localStorage.getItem("redirectUrl")

  useEffect(() => {
    const savedCredentials = localStorage.getItem("userCredentials");
    if (savedCredentials) {
      setFormData(JSON.parse(savedCredentials));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      CredentialsSchema.parse(formData);
      const resultAction = await dispatch(login(formData));
      if (login.fulfilled.match(resultAction)) {
        const userInfoAction = await dispatch(getUserInfo());
        // console.log("userInfoAction", userInfoAction);
        if (getUserInfo.fulfilled.match(userInfoAction)) {
          toast({
            title: "Đăng nhập thành công!",
            description: `Chào mừng ${userInfoAction.payload.result.firstName} ${userInfoAction.payload.result.lastName} quay trở lại 👋`,
            duration: 5000,
            variant: "default"
          });
          navigate(redirectUrl || "/");
          if (rememberMe) {
            localStorage.setItem("userCredentials", JSON.stringify(formData));
          } else {
            localStorage.removeItem("userCredentials");
          }
          localStorage.removeItem("redirectUrl");
        } else {
          toast({
            variant: "destructive",
            description: "Không thể lấy thông tin người dùng. Vui lòng thử lại.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          description: (resultAction.payload as string) || "Đăng nhập thất bại. Vui lòng thử lại.",
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = err.errors[0].message;
        toast({
          variant: "destructive",
          description: errorMessage,
        });
      } else {
        toast({
          variant: "destructive",
          description: "Đã xảy ra lỗi không xác định",
        });
      }
    }
  };

  const handleGoogleLoginSuccess = async (tokenResponse: any) => {
    try {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }
      );
      const { family_name, given_name, email, picture } = userInfo.data;
      const resultAction = await dispatch(
        loginWithGoogle({
          familyName: family_name,
          givenName: given_name,
          email: email,
          avatar: picture,
        })
      );
      console.log("resultAction", resultAction);

      if (loginWithGoogle.fulfilled.match(resultAction)) {
        const userInfoAction = await dispatch(getUserInfo());
        if (getUserInfo.fulfilled.match(userInfoAction)) {
          toast({ description: "Đăng nhập Google thành công." });
          console.log("userInfoAction", userInfoAction);
          navigate(redirectUrl || "/")
          localStorage.removeItem("redirectUrl");
        } else {
          toast({
            variant: "destructive",
            description:
              "Không thể lấy thông tin người dùng. Vui lòng thử lại.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          description:
            (resultAction.payload as string) ||
            "Đăng nhập Google thất bại. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      toast({
        variant: "destructive",
        description:
          "Không thể lấy thông tin người dùng từ Google hoặc đăng nhập thất bại.",
      });
    }
  };

  const handleFacebookLoginSuccess = async (response: any) => {
    try {
      const { name, email, picture, id } = response.data;
      const [givenName, ...familyNameParts] = name.split(" ");
      const familyName = familyNameParts.join(" ");
      const resultAction = await dispatch(
        loginWithFacebook({
          familyName: familyName,
          givenName: givenName,
          email: email || `facebook.${id}@facebook.com`,
          avatar: picture?.data?.url,
          accessToken: response.accessToken,
        })
      );

      if (loginWithGoogle.fulfilled.match(resultAction)) {
        const userInfoAction = await dispatch(getUserInfo());
        if (getUserInfo.fulfilled.match(userInfoAction)) {
          toast({ description: "Đăng nhập Facebook thành công." });
          navigate(redirectUrl || "/")
          localStorage.removeItem("redirectUrl");
        } else {
          toast({
            variant: "destructive",
            description:
              "Không thể lấy thông tin người dùng. Vui lòng thử lại.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          description:
            (resultAction.payload as string) ||
            "Đăng nhập Facebook thất bại. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      console.error("Error during Facebook login:", error);
      toast({
        variant: "destructive",
        description:
          "Không thể lấy thông tin người dùng từ Facebook hoặc đăng nhập thất bại.",
      });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: () => {
      console.log("Google Login Failed");
      toast({
        variant: "destructive",
        description: "Đăng nhập Google thất bại.",
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <Card className="w-full max-w-md shadow-2xl relative">
        <Link to="/" className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition-transform duration-300 hover:rotate-180">
          <X className="h-6 w-6 text-gray-600" />
        </Link>
        <CardHeader className="space-y-1 pb-8">
          <div className="flex items-center justify-center mb-6">
            <Megaphone className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl text-center font-bold text-gray-800">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Nhập tên người dùng và mật khẩu để truy cập tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            <FormInput
              id="username"
              name="username"
              label="Email"
              placeholder="Nhập email"
              value={formData.username}
              onChange={handleChange}
              required
              icon={<Mail className="h-5 w-5" />}
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
            />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition duration-300 ease-in-out"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked: any) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
                  Nhớ tài khoản
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-green-500 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              onClick={() => googleLogin()}
              className="w-full bg-white hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-md transition duration-300 ease-in-out flex items-center justify-center border border-gray-300"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
              Đăng nhập bằng Google
            </Button>
            <Button
              onClick={() => {
                const loginSocialFacebook = document.querySelector(".facebook-login-button");
                if (loginSocialFacebook) {
                  (loginSocialFacebook as HTMLElement).click();
                }
              }}
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-3 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Đăng nhập bằng Facebook
            </Button>
            <LoginSocialFacebook
              appId={import.meta.env.VITE_FACEBOOK_APP_ID}
              onResolve={handleFacebookLoginSuccess}
              onReject={(error: any) => {
                console.log(error);
                toast({
                  variant: "destructive",
                  description: "Đăng nhập Facebook thất bại.",
                });
              }}
            >
              <button style={{ display: "none" }} className="facebook-login-button" />
            </LoginSocialFacebook>
            <div className="text-center">
              <Link to="/register" className="text-sm text-green-500 hover:underline">
                Bạn chưa có tài khoản? Đăng ký
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
