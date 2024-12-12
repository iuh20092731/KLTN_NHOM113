package com.apartmentservices.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.apartmentservices.dto.request.CategoryCreationRequest;
import com.apartmentservices.dto.request.CategoryUpdateRequest;
import com.apartmentservices.dto.response.AdvertisementServiceMediaResponse;
import com.apartmentservices.dto.response.CategoryResponse;
import com.apartmentservices.dto.response.AdvertisementServiceResponse;
import com.apartmentservices.exception.AppException;
import com.apartmentservices.exception.ErrorCode;
import com.apartmentservices.mapper.CategoryMapper;
import com.apartmentservices.models.AdvertisementServiceMedia;
import com.apartmentservices.models.Category;
import com.apartmentservices.models.AdvertisementService;
import com.apartmentservices.repositories.AdvertisementServiceMediaRepository;
import com.apartmentservices.repositories.CategoryRepository;
import com.apartmentservices.repositories.AdvertisementServiceRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoryService {

    CategoryRepository categoryRepository;
    AdvertisementServiceRepository advertisementServiceRepository;
    AdvertisementServiceMediaRepository advertisementServiceMediaRepository;
    CategoryMapper categoryMapper;

    @Transactional
    public CategoryResponse createCategory(CategoryCreationRequest request) {
        Integer categorySeq = request.getCategorySeq();

        // Nếu người dùng không truyền categorySeq, đặt nó bằng giá trị cao nhất + 1
        if (categorySeq == null) {
            categorySeq = categoryRepository.findMaxCategorySeq().orElse(0) + 1;
        }

        Category category = Category.builder()
                .categoryName(request.getCategoryName())
                .categoryNameNoDiacritics(request.getCategoryNameNoDiacritics())
                .imageLink(request.getImageLink())
                .categorySeq(categorySeq)
                .createdDate(LocalDateTime.now())
                .updatedDate(LocalDateTime.now())
                .isActive(true) // Hoặc giá trị mặc định của bạn
                .build();

        try {
            return categoryMapper.toResponse(categoryRepository.save(category));
        } catch (Exception e) {
            log.error("Error creating Category", e);
            throw new AppException(ErrorCode.CATEGORY_CREATION_FAILED);
        }
    }

    @Transactional
    public CategoryResponse getCategory(Integer categoryId) {
        // Tìm kiếm danh mục theo ID
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        // Tìm kiếm các dịch vụ quảng cáo thuộc danh mục
        List<AdvertisementService> advertisementServices = advertisementServiceRepository.findByCategory_CategoryId(categoryId);

        // Chuyển đổi danh sách dịch vụ thành danh sách phản hồi dịch vụ với thông tin media
        List<AdvertisementServiceResponse> advertisementServiceResponses = advertisementServices.stream()
                .map(ad -> {
                    // Tìm kiếm media cho dịch vụ hiện tại
                    List<AdvertisementServiceMediaResponse> mediaResponses = advertisementServiceMediaRepository.findByServiceId(ad.getServiceId()).stream()
                            .map(this::toMediaResponse)
                            .collect(Collectors.toList());

                    // Xây dựng phản hồi dịch vụ với thông tin media
                    return AdvertisementServiceResponse.builder()
                            .serviceId(ad.getServiceId())
                            .serviceName(ad.getServiceName())
                            .description(ad.getDescription())
                            .deliveryAvailable(ad.getDeliveryAvailable())
                            .categoryId(ad.getCategory().getCategoryId())
                            .media(mediaResponses) // Thiết lập media cho mỗi dịch vụ
                            .build();
                })
                .collect(Collectors.toList());

        // Xây dựng phản hồi danh mục
        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .imageLink(category.getImageLink()) // Nếu bạn cần trả về hình ảnh của danh mục
                .categorySeq(category.getCategorySeq())
                .createdDate(category.getCreatedDate())
                .updatedDate(category.getUpdatedDate())
                .advertisementServices(advertisementServiceResponses) // Trả về dịch vụ với media
                .build();
    }
    @Transactional
    public CategoryResponse getCategory2(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        List<AdvertisementService> advertisementServices = advertisementServiceRepository.findByCategory_CategoryId(categoryId);

        List<AdvertisementServiceResponse> advertisementServiceResponses = advertisementServices.stream()
                .map(ad -> {
                    List<AdvertisementServiceMediaResponse> mediaResponses = advertisementServiceMediaRepository.findByServiceId(ad.getServiceId()).stream()
                            .map(this::toMediaResponse)
                            .collect(Collectors.toList());

                    return AdvertisementServiceResponse.builder()
                            .serviceId(ad.getServiceId())
                            .serviceName(ad.getServiceName())
                            .description(ad.getDescription())
                            .deliveryAvailable(ad.getDeliveryAvailable())
                            .categoryId(ad.getCategory().getCategoryId())
                            .media(mediaResponses) // Set media for each service
                            .build();
                })
                .collect(Collectors.toList());

        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .advertisementServices(advertisementServiceResponses) // Return services with media
                .build();
    }

    private AdvertisementServiceMediaResponse toMediaResponse(AdvertisementServiceMedia media) {
        return AdvertisementServiceMediaResponse.builder()
                .mediaId(media.getMediaId())
                .mediaUrl(media.getMediaUrl())
                .build();
    }

//    public List<CategoryResponse> getAllCategories() {
//        return categoryRepository.findAllByOrderByCategorySeqAsc().stream()
//                .map(categoryMapper::toResponse)
//                .collect(Collectors.toList());
//    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategoriesOrderedBySeq() {
        List<Category> categories = categoryRepository.findAllByOrderByCategorySeqAsc();
        return categories.stream()
                .map(category -> {
                    CategoryResponse response = categoryMapper.toResponse(category);
                    // Đặt advertisementServices thành null nếu không muốn bao gồm nó
                    response.setAdvertisementServices(null);
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse updateCategory(Integer categoryId, CategoryUpdateRequest request) {
        return categoryRepository.findById(categoryId)
                .map(category -> {
                    category.setCategoryName(request.getCategoryName());
                    category.setImageLink(request.getImageLink());
                    category.setUpdatedDate(LocalDateTime.now());
                    category.setCategoryNameNoDiacritics(request.getCategoryNameNoDiacritics());
                    category.setIsActive(request.getIsActive());
                    return categoryMapper.toResponse(categoryRepository.save(category));
                })
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    @Transactional
    public void deleteCategory(Integer categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        try {
            categoryRepository.deleteById(categoryId);
        } catch (Exception e) {
            log.error("Error deleting Category", e);
            throw new AppException(ErrorCode.CATEGORY_DELETION_FAILED);
        }
    }

    @Transactional
    public CategoryResponse updateCategoryStatus(Integer categoryId, Boolean isActive) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        category.setIsActive(isActive);
        category.setUpdatedDate(LocalDateTime.now());

        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse getCategoryByCategoryNameNoDiacritics(String categoryNameNoDiacritics) {
        Category category = categoryRepository.findFirstByCategoryNameNoDiacriticsContainingIgnoreCase(categoryNameNoDiacritics)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        return categoryMapper.toResponse(category);
    }



}
