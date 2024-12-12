package com.apartmentservices.models;

import java.time.LocalDateTime;
import java.util.Set;

import com.apartmentservices.constant.UserType;
import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String userId;

    @Column(name = "username", unique = true, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String username;

    String password;

    @Column(unique = true)
    String email;

    @Column(columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String firstName;

    @Column(columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String lastName;

    @Column(columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String phoneNumber;

    @Column(columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String zalo;

    @Column(columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String facebook;

    @Column(columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String avatar;

    boolean isActive;

    @Enumerated(EnumType.STRING)  // Thêm định nghĩa kiểu enum cho loại user
    @Column(name = "user_type")
    UserType userType;

    @ManyToMany
    Set<Role> roles;

    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (!this.isActive) {
            this.isActive = false;
        }
        this.createdAt = LocalDateTime.now(); // Thiết lập ngày tạo mặc định
    }
}
