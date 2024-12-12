package com.apartmentservices.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MonthlyUserStatsResponse {
    Long totalActiveUsers; // Tổng số người dùng hoạt động
    Double percentageChange;
}
