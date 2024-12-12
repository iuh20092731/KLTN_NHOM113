package com.apartmentservices.success;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiSuccessResponse {
    private int code;
    private String message;
}