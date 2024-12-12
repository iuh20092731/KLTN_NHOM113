package com.apartmentservices.controller;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.qacorner.QACornerQuestionCreationRequest;
import com.apartmentservices.dto.request.qacorner.QACornerQuestionUpdateRequest;
import com.apartmentservices.dto.response.qacorner.QACornerQuestionResponse;
import com.apartmentservices.dto.response.qacorner.QuestionResponse;
import com.apartmentservices.models.qacorner.QACorner_Comment;
import com.apartmentservices.services.QACorner_CommentService;
import com.apartmentservices.services.QACorner_QuestionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Question Controller", description = "APIs for managing questions in QA Corner")
public class QACorner_QuestionController {

    QACorner_QuestionService questionService;
    QACorner_CommentService commentService;

    @Operation(summary = "Get questions with comments", description = "Get a paginated list of questions with comments (including parent and child comments)")
    @GetMapping
    public ApiResponse<Page<QuestionResponse>> getQuestionsWithComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // Lấy câu hỏi có paging từ service
        Page<QuestionResponse> questions = questionService.getQuestionsWithComments(page, size);

        return ApiResponse.<Page<QuestionResponse>>builder()
                .result(questions)
                .build();
    }

    @Operation(summary = "Create Question", description = "Create a new question")
    @PostMapping
    ApiResponse<QACornerQuestionResponse> createQuestion(@RequestBody @Valid QACornerQuestionCreationRequest request) {
        QACornerQuestionResponse response = questionService.createQuestion(request);
        return ApiResponse.<QACornerQuestionResponse>builder()
                .result(response)
                .build();
    }

    @Operation(summary = "Increase likes for a question", description = "Increase the like count for a specific question")
    @PutMapping("/{questionId}/likes")
    public ApiResponse<Void> increaseLikes(@PathVariable Integer questionId) {
        questionService.increaseLikes(questionId);
        return ApiResponse.<Void>builder()
                .message("Likes increased successfully")
                .build();
    }


//    @Operation(summary = "Get All Questions", description = "Retrieve all questions")
//    @GetMapping
//    ApiResponse<List<QACornerQuestionResponse>> getAllQuestions() {
//        List<QACornerQuestionResponse> responseList = questionService.getAllQuestions();
//        return ApiResponse.<List<QACornerQuestionResponse>>builder()
//                .result(responseList)
//                .build();
//    }

    @Operation(summary = "Get Question by ID", description = "Retrieve a question by its ID")
    @GetMapping("/{id}")
    ApiResponse<QACornerQuestionResponse> getQuestionById(@PathVariable Integer id) {
        QACornerQuestionResponse response = questionService.getQuestionById(id);
        return ApiResponse.<QACornerQuestionResponse>builder()
                .result(response)
                .build();
    }

    @Operation(summary = "Update Question", description = "Update an existing question")
    @PutMapping("/{id}")
    ApiResponse<QACornerQuestionResponse> updateQuestion(@PathVariable Integer id,
                                                         @RequestBody @Valid QACornerQuestionUpdateRequest request) {
        QACornerQuestionResponse response = questionService.updateQuestion(id, request);
        return ApiResponse.<QACornerQuestionResponse>builder()
                .result(response)
                .build();
    }

//    @Operation(summary = "Delete Question", description = "Delete a question by its ID")
//    @DeleteMapping("/{id}")
//    ApiResponse<String> deleteQuestion(@PathVariable Integer id) {
//        questionService.deleteQuestion(id);
//        return ApiResponse.<String>builder()
//                .result("Question deleted successfully")
//                .build();
//    }

    @Operation(summary = "Delete Question", description = "Delete a question by its ID")
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteQuestion(@PathVariable Integer id) {
        // Gọi service xóa các comment liên quan đến câu hỏi
        commentService.deleteCommentsByQuestionId(id);

        // Sau khi xóa các comment, xóa câu hỏi
        questionService.deleteQuestion(id);

        return ApiResponse.<String>builder()
                .result("Question and its comments deleted successfully")
                .build();
    }

}
