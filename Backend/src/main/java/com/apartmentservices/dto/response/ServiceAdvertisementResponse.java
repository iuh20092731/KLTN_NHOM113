package com.apartmentservices.dto.response;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceAdvertisementResponse {
    private String serviceName;
    private List<MainAdvertisementResponse> responseList;
}
