package com.apartmentservices.dto.response.info;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SocialGroupLinkResponse {
    Integer id;
    Integer serial;
    String platform;
    String groupName;
    String groupLink;
    String description;
    String remark;
    Boolean isActive;
    String imageUrl;
}