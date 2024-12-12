package com.apartmentservices.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCreationRequest {

    @NotNull
    private Integer advertisementId;

    @NotNull
    private String userId;

    @NotNull
    private Integer rating;

    private String reviewContent;
}
