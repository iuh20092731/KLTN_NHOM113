package com.apartmentservices.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RealEstateMediaResponse {

    Integer mediaId;
    String mediaUrl;
    String mediaType;
    Integer seq;

    // Constructor to initialize from RealEstateMedia entity
    public RealEstateMediaResponse(Integer mediaId, String mediaUrl, String mediaType, Integer seq) {
        this.mediaId = mediaId;
        this.mediaUrl = mediaUrl;
        this.mediaType = mediaType;
        this.seq = seq;
    }

    // Optionally, you can create a constructor that maps directly from RealEstateMedia entity
    public RealEstateMediaResponse(com.apartmentservices.models.RealEstateMedia media) {
        this.mediaId = media.getMediaId();
        this.mediaUrl = media.getMediaUrl();
        this.mediaType = media.getMediaType();
        this.seq = media.getSeq();
    }
}
