package com.apartmentservices.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "AdvertisementMedia")
public class AdvertisementMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MediaID", nullable = false)
    Integer id;

    @Column(name = "MediaName", length = 255, nullable = false, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String name;

    @Column(name = "Content", columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String content;

    @Column(name = "MediaURL", length = 255, nullable = false, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String url;

    @Enumerated(EnumType.STRING)
    @Column(name = "MediaType", nullable = false)
    MediaType type;

    @CreationTimestamp
    @Column(name = "CreatedDate", updatable = false)
    LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "UpdatedDate")
    LocalDateTime updatedDate;

    // Ràng buộc ManyToOne tới MainAdvertisement
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AdvertisementID", nullable = false)
    @JsonBackReference
    MainAdvertisement advertisement;

    // Enumeration for Media Type
    public enum MediaType {
        IMAGE,  // Hình ảnh
        VIDEO,  // Video
        BANNER  // Banner
    }
}
