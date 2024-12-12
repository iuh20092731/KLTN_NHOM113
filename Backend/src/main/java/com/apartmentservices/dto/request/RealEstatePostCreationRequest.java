package com.apartmentservices.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RealEstatePostCreationRequest {

    @NotBlank(message = "POST_TYPE_REQUIRED")
    String postType;  // Loại tin đăng

    @NotBlank(message = "CONTENT_REQUIRED")
    String content;  // Nội dung tin đăng

    String contactPhoneNumber;  // Số điện thoại liên hệ

    Boolean isAnonymous;  // Ẩn danh
}
