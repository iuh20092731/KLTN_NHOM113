package com.apartmentservices.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdvertisementServiceMediaResponse {
    private Integer mediaId;
    private String mediaUrl;
    private Integer serviceId;
}
