package com.apartmentservices.controller;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.qacorner.QACornerCommentCreationRequest;
import com.apartmentservices.dto.request.qacorner.QACornerCommentUpdateRequest;
import com.apartmentservices.dto.response.qacorner.QACornerCommentResponse;
import com.apartmentservices.services.QACorner_CommentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Comment Controller", description = "APIs for managing comments in QA Corner")
public class QACorner_CommentController {

    QACorner_CommentService commentService;

    @Operation(summary = "Create Comment", description = "Create a new comment")
    @PostMapping
    public ApiResponse<QACornerCommentResponse> createComment(@RequestBody @Valid QACornerCommentCreationRequest request) {
        QACornerCommentResponse response = commentService.createComment(request);
        return ApiResponse.<QACornerCommentResponse>builder()
                .result(response)
                .build();
    }

    @Operation(summary = "Create Reply for Comment", description = "Create a reply for an existing comment")
    @PostMapping("/{commentId}/replies")
    public ApiResponse<QACornerCommentResponse> createReply(@PathVariable Integer commentId,
                                                            @RequestBody @Valid QACornerCommentCreationRequest request) throws Exception {
        QACornerCommentResponse response = commentService.createReply(commentId, request);
        return ApiResponse.<QACornerCommentResponse>builder()
                .result(response)
                .build();
    }

    @Operation(summary = "Get All Comments", description = "Retrieve all comments")
    @GetMapping
    ApiResponse<List<QACornerCommentResponse>> getAllComments() {
        // Retrieve all comments and return a list of responses
        List<QACornerCommentResponse> responseList = commentService.getAllComments();
        return ApiResponse.<List<QACornerCommentResponse>>builder()
                .result(responseList)
                .build();
    }

    @Operation(summary = "Get Comment by ID", description = "Retrieve a comment by its ID")
    @GetMapping("/{id}")
    ApiResponse<QACornerCommentResponse> getCommentById(@PathVariable Integer id) {
        // Retrieve a single comment by ID and return its response
        QACornerCommentResponse response = commentService.getCommentById(id);
        return ApiResponse.<QACornerCommentResponse>builder()
                .result(response)
                .build();
    }

    @Operation(summary = "Update Comment", description = "Update an existing comment")
    @PutMapping("/{id}")
    ApiResponse<QACornerCommentResponse> updateComment(@PathVariable Integer id,
                                                       @RequestBody @Valid QACornerCommentUpdateRequest request) {
        // Update an existing comment and return its response
        QACornerCommentResponse response = commentService.updateComment(id, request);
        return ApiResponse.<QACornerCommentResponse>builder()
                .result(response)
                .build();
    }

    @Operation(summary = "Delete Comment", description = "Delete a comment by its ID")
    @DeleteMapping("/{id}")
    ApiResponse<String> deleteComment(@PathVariable Integer id) {
        // Delete the comment by ID
        commentService.deleteComment(id);
        return ApiResponse.<String>builder()
                .result("Comment deleted successfully")
                .build();
    }
}
