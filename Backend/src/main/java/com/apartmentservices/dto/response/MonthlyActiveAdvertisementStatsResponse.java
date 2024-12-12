package com.apartmentservices.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MonthlyActiveAdvertisementStatsResponse {

    // Số lượng quảng cáo đang chạy trong tháng hiện tại
    Long activeAdvertisementsCount;

    // Tháng và năm hiện tại
    Integer month;
    Integer year;
}