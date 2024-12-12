package com.apartmentservices.dto.response;

import com.apartmentservices.constant.BannerType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BannerResponse {
    private Integer bannerId;
    private String imageUrl;
    private String linkUrl;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
    private BannerType type;
    private Integer seq;
    private Integer serial;
}
