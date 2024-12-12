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
@Table(name = "ReviewMedia")
public class ReviewMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MediaID", nullable = false)
    Integer mediaId;

    // Ràng buộc ManyToOne tới Review
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ReviewID", nullable = false)
    Review review;

    @Enumerated(EnumType.STRING)
    @Column(name = "MediaType", nullable = false)
    MediaType mediaType;

    @Column(name = "MediaURL", length = 255, nullable = false)
    String mediaUrl;

    // Enumeration for Media Type
    public enum MediaType {
        Image, Video
    }
}
