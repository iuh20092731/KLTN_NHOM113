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
@Table(name = "Otp")
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String otpId;

    @Column(name = "otp_code", nullable = false)
    String otpCode;

    @Column(name = "expires_at", nullable = false)
    LocalDateTime expiresAt;

    @Column(name = "verified", nullable = false)
    boolean verified;

    // Thêm mối quan hệ với User
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_email", referencedColumnName = "email", unique = true)  // Liên kết bằng email
    User user;

    @PrePersist
    public void prePersist() {
        if (!this.verified) {
            this.verified = false;  // Mặc định chưa được xác thực
        }
    }
}
