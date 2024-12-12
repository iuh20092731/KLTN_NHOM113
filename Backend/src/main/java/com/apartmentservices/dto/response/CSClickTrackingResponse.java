package com.apartmentservices.dto.response;

import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CSClickTrackingResponse {

//    Long id;
//    Integer type; // 1: Category, 2: Service
//    Integer valueId; // ID của Category hoặc Service
    long clickCount;
//    String remark;
}
