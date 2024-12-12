package com.apartmentservices.models;

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
@Table(name = "RealEstateMedia")
public class RealEstateMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MediaID", nullable = false)
    Integer mediaId;

    @ManyToOne
    @JoinColumn(name = "ListingID", nullable = false)
    RealEstateListing realEstateListing;

    @Column(name = "MediaURL", columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci", nullable = false)
    String mediaUrl;

    @Column(name = "MediaType", columnDefinition = "VARCHAR(50) COLLATE utf8mb4_unicode_ci", nullable = false)
    String mediaType; // Ví dụ: "image/jpeg", "image/png"

    @Column(name = "Seq", nullable = false, columnDefinition = "INT DEFAULT 0")
    Integer seq; // Thứ tự hiển thị
}
