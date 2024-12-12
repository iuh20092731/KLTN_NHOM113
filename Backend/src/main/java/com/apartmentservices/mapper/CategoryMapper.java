package com.apartmentservices.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.apartmentservices.dto.request.CategoryCreationRequest;
import com.apartmentservices.dto.request.CategoryUpdateRequest;
import com.apartmentservices.dto.response.CategoryResponse;
import com.apartmentservices.dto.response.AdvertisementServiceResponse;
import com.apartmentservices.models.Category;
import com.apartmentservices.models.AdvertisementService;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "categorySeq", source = "categorySeq", defaultExpression = "java(null)") // Ensure default value handling if needed
    Category toCategory(CategoryCreationRequest request);

    @Mapping(target = "categorySeq", source = "categorySeq")
    @Mapping(target = "createdDate", source = "createdDate", defaultExpression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "updatedDate", source = "updatedDate", defaultExpression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "categoryNameNoDiacritics", source = "categoryNameNoDiacritics")
    @Mapping(target = "isActive", source = "isActive")
    @Mapping(target = "remark", source = "remark")
    CategoryResponse toResponse(Category category);

    @Mapping(target = "serviceId", source = "serviceId")
    @Mapping(target = "serviceName", source = "serviceName")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "deliveryAvailable", source = "deliveryAvailable")
    @Mapping(target = "categoryId", source = "category.categoryId")
    AdvertisementServiceResponse toAdvertisementServiceResponse(AdvertisementService advertisementService);

    @Mapping(target = "categoryName", source = "categoryName")
    @Mapping(target = "imageLink", source = "imageLink")
    @Mapping(target = "categorySeq", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateCategory(@MappingTarget Category category, CategoryUpdateRequest request);
}
