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
@Table(name = "ServiceMedia")
public class AdvertisementServiceMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer mediaId;

    @ManyToOne
    @JoinColumn(name = "ServiceID", nullable = false)
    AdvertisementService advertisementService;

    @Column(name = "MediaType", nullable = false)
    @Enumerated(EnumType.STRING)
    MediaType mediaType;

    @Column(name = "MediaURL", nullable = false, length = 255)
    String mediaUrl;

    public enum MediaType {
        IMAGE, VIDEO, BANNER
    }
}
