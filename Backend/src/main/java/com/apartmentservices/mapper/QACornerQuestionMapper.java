package com.apartmentservices.mapper;

import com.apartmentservices.dto.request.qacorner.QACornerQuestionCreationRequest;
import com.apartmentservices.dto.request.qacorner.QACornerQuestionUpdateRequest;
import com.apartmentservices.dto.response.qacorner.QACornerQuestionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.apartmentservices.models.qacorner.QACorner_Question;

@Mapper(componentModel = "spring")
public interface QACornerQuestionMapper {

    @Mapping(target = "content", source = "content")
    @Mapping(target = "user.userId", source = "createdByUserId",
            nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "createdAt", source = "createDate",
            nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    QACorner_Question toEntity(QACornerQuestionCreationRequest request);


    @Mapping(target = "content", source = "content")
    @Mapping(target = "createdAt", source = "createDate")
    QACorner_Question toEntity_V2(QACornerQuestionCreationRequest request);

    @Mapping(target = "content", source = "content")
    @Mapping(target = "id", source = "questionId")
    QACornerQuestionResponse toResponse(QACorner_Question question);

    @Mapping(target = "content", source = "content")
//    @Mapping(target = "id", source = "questionId")
    void updateEntity(@MappingTarget QACorner_Question question, QACornerQuestionUpdateRequest request);
}
