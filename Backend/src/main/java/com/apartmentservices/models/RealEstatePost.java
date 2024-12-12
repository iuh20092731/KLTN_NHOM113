package com.apartmentservices.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "RealEstatePosts")
public class RealEstatePost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PostID", nullable = false)
    Integer postId;

    @Column(name = "IsAnonymous", nullable = false)
    Boolean isAnonymous;  // Ẩn danh

    @Column(name = "PostType", columnDefinition = "VARCHAR(50) COLLATE utf8mb4_unicode_ci", nullable = false)
    String postType; // Loại tin đăng, ví dụ: "Cần mua"

    @Column(name = "Content", columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci", nullable = false)
    String content;

    @Column(name = "ContactPhoneNumber", columnDefinition = "VARCHAR(20) COLLATE utf8mb4_unicode_ci")
    String contactPhoneNumber;

    @Column(name = "CreatedAt", nullable = false, updatable = false)
    LocalDateTime createdAt; // Thời gian tạo bài viết

    @Column(name = "Views", nullable = false, columnDefinition = "INT DEFAULT 0")
    Integer views;

    @Column(name = "IsNew", nullable = false)
    Boolean isNew;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now(); // Cập nhật thời gian tạo bài viết
        this.views = 0; // Khởi tạo số lượt xem
        this.isNew = true; // Đánh dấu bài viết là mới
    }
}
