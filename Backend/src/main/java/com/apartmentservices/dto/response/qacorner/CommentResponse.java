package com.apartmentservices.dto.response.qacorner;

import com.apartmentservices.dto.response.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Integer CommentId;
    private String content;
    private Integer parentId; // Nếu có comment cha
    private LocalDateTime createdDate;
    private UserResponse user;
    private List<CommentResponse> replies; // Các comment con (replies)
}