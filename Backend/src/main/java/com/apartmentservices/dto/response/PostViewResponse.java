package com.apartmentservices.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostViewResponse {
    private Integer postId;
    private Integer views;
}
