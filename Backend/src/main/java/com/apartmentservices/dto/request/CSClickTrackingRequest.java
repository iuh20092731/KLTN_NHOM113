package com.apartmentservices.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CSClickTrackingRequest {

    @NotNull
    Integer type; // 1: Category, 2: Service

    @NotNull
    Integer valueId; // ID của Category hoặc Service
}
