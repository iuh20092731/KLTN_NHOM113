package com.apartmentservices.dto.request.v2;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdvertisementServiceUpdateRequest_V2 {

    String serviceName;

    String description;


    Boolean deliveryAvailable;


    Integer categoryId; // ID của danh mục

    Boolean isActive; // Trạng thái hoạt động

    List<ServiceMediaUpdateRequest_V2> advertisementMedia; // Danh sách media
}
