package com.apartmentservices.dto.response;

import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RealEstatePostResponse {

    Integer postId;  // ID bài đăng
    String postType;  // Loại tin đăng
    String content;  // Nội dung tin đăng
    String contactPhoneNumber;  // Số điện thoại liên hệ
    Boolean isAnonymous;  // Ẩn danh
    LocalDateTime createdAt;  // Thời gian tạo bài viết
    Integer views;  // Số lượt xem
    Boolean isNew;  // Đánh dấu bài viết là mới
    String timeAgo;  // Thời gian đã trôi qua kể từ khi bài đăng được tạo
}
