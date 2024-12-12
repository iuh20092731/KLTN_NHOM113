package com.apartmentservices.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RealEstatePostUpdateRequest {

    Integer postId;  // ID của bài đăng

    String postType;  // Loại tin đăng
    String content;  // Nội dung tin đăng
    String contactPhoneNumber;  // Số điện thoại liên hệ
    Boolean isAnonymous;  // Ẩn danh
}
