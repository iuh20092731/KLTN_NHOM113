package com.apartmentservices.mapper;

import com.apartmentservices.dto.response.qacorner.CommentResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.apartmentservices.dto.request.qacorner.QACornerCommentCreationRequest;
import com.apartmentservices.dto.request.qacorner.QACornerCommentUpdateRequest;
import com.apartmentservices.dto.response.qacorner.QACornerCommentResponse;
import com.apartmentservices.models.qacorner.QACorner_Comment;

@Mapper(componentModel = "spring")
public interface QACornerCommentMapper {

    @Mapping(target = "question.questionId", source = "questionId")
    @Mapping(target = "content", source = "commentText")
    @Mapping(target = "user.userId", source = "createdByUserId")
    @Mapping(target = "createdAt", source = "createDate")
    QACorner_Comment toQACornerComment(QACornerCommentCreationRequest request);

    @Mapping(target = "question.questionId", source = "questionId")
    @Mapping(target = "content", source = "commentText")
    @Mapping(target = "createdAt", source = "createDate")
    QACorner_Comment toQACornerComment_V2(QACornerCommentCreationRequest request);

    @Mapping(target = "commentId", source = "comment.commentId")
    @Mapping(target = "commentText", source = "comment.content")
//    @Mapping(target = "createdByUserId", source = "user.userId") // user.userId từ request ánh xạ vào user
    @Mapping(target = "createdDate", source = "comment.createdAt")
//    @Mapping(target = "updatedByUserId", source = "user.userId")
//    @Mapping(target = "updatedDate", source = "comment.updatedDate")
    @Mapping(target = "questionId", source = "comment.question.questionId")
    @Mapping(target = "parentCommentId", source = "comment.parentComment.commentId")
    QACornerCommentResponse toResponse(QACorner_Comment comment);

    @Mapping(target = "commentId", source = "comment.commentId")
    @Mapping(target = "content", source = "comment.content")
//    @Mapping(target = "createdByUserId", source = "user.userId") // user.userId từ request ánh xạ vào user
    @Mapping(target = "createdDate", source = "comment.createdAt")
//    @Mapping(target = "updatedByUserId", source = "user.userId")
//    @Mapping(target = "updatedDate", source = "comment.updatedDate")
//    @Mapping(target = "questionId", source = "comment.question.questionId")
    @Mapping(target = "parentId", source = "comment.parentComment.commentId")
    CommentResponse toResponse_V2(QACorner_Comment comment);

//    @Mapping(target = "content", source = "request.commentText")
//    @Mapping(target = "updatedByUserId", source = "request.updatedByUserId")
    void updateQACornerComment(@MappingTarget QACorner_Comment comment, QACornerCommentUpdateRequest request);
}
