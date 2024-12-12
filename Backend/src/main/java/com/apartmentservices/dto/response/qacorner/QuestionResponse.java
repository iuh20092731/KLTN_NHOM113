package com.apartmentservices.dto.response.qacorner;

import com.apartmentservices.dto.response.UserResponse;
import com.apartmentservices.models.User;
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
public class QuestionResponse {
    private Integer id;
    private String content;
    private LocalDateTime createDate;
    private Integer likeCount;
    private UserResponse user;
    private List<CommentResponse> comments; // Dành cho danh sách comment của question

}
