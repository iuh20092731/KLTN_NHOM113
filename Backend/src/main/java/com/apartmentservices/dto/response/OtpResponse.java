package com.apartmentservices.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpResponse {
    String userId;
    String email;        // Địa chỉ email của người dùng
    String otp;          // Mã OTP được gửi
    boolean verified;    // Trạng thái xác thực của người dùng
    String message;      // Thông điệp trả về
    String message2;
}
