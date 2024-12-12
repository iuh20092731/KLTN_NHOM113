package com.apartmentservices.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "Reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReviewID", nullable = false)
    Integer reviewId;

    // Ràng buộc ManyToOne tới Advertisement
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AdvertisementID", nullable = false)
    MainAdvertisement advertisement;

    // Ràng buộc ManyToOne tới User (Người dùng viết đánh giá)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    User user;

    @Column(name = "Rating")
    Integer rating;

    @Column(name = "ReviewContent", columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String reviewContent;

    @Column(name = "ReviewDate")
    LocalDateTime reviewDate;

    @PrePersist
    public void prePersist() {
        if (reviewDate == null) {
            reviewDate = LocalDateTime.now();
        }
    }
}
