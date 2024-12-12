package com.apartmentservices.dto.request.info;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SocialGroupLinkUpdateRequest {
    String platform;
    String groupName;
    String groupLink;
    String description;
    String remark;
    Boolean isActive;
}