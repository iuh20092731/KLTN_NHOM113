package com.apartmentservices.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClickTrackingReportResponse {
    Integer type;
    Integer valueId;
    String name;
    long clickCount;
    LocalDateTime lastClicked;
    long previousMonthClickCount;
}


//    {
//            "type": 1,
//            "valueId": 1,
//            "name": "Tất cả",
//            "clickCount": 654,
//            "lastClicked": "2024-12-11T17:55:09.420173",
//            "previousMonthClickCount": 332
//            },