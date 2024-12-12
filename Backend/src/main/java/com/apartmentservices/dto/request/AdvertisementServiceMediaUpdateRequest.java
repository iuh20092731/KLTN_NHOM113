package com.apartmentservices.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdvertisementServiceMediaUpdateRequest {
    private String mediaUrl;
    private Integer serviceId;
}
