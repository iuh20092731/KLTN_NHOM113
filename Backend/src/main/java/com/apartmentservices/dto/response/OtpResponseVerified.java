package com.apartmentservices.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpResponseVerified {
    String userId;
    String email;
    boolean verified;    // Trạng thái xác thực của người dùng
    String message;
}
