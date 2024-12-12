package com.apartmentservices.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClickTrackingReportResponse_V2 {
    Integer type;
    String imageLink;
    Integer valueId;
    String categoryName;
    Long clickCount;
    LocalDateTime lastClicked;
    Long previousMonthClickCount;

    // Constructor with parameters matching the query
    public ClickTrackingReportResponse_V2(Integer type, String imageLink, Integer valueId, String categoryName,
                                          Long clickCount, LocalDateTime lastClicked, Long previousMonthClickCount) {
        this.type = type;
        this.imageLink = imageLink;
        this.valueId = valueId;
        this.categoryName = categoryName;
        this.clickCount = clickCount;
        this.lastClicked = lastClicked;
        this.previousMonthClickCount = previousMonthClickCount;
    }
}
