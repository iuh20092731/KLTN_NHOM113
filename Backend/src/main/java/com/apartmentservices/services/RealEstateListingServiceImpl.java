package com.apartmentservices.services;

import com.apartmentservices.constant.RealEstateType;
import com.apartmentservices.dto.request.RealEstateListingCreationRequest;
import com.apartmentservices.dto.request.RealEstateListingUpdateRequest;
import com.apartmentservices.dto.response.RealEstateListingResponse;
import com.apartmentservices.dto.response.RealEstateMediaResponse;
import com.apartmentservices.mapper.RealEstateListingMapper;
import com.apartmentservices.models.RealEstateListing;
import com.apartmentservices.models.RealEstateMedia;
import com.apartmentservices.models.User;
import com.apartmentservices.repositories.RealEstateListingRepository;
import com.apartmentservices.repositories.UserRepository;
import com.apartmentservices.services.RealEstateListingService;
import com.apartmentservices.exception.AppException;
import com.apartmentservices.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RealEstateListingServiceImpl implements RealEstateListingService {

    private final RealEstateListingRepository realEstateListingRepository;
    private final RealEstateListingMapper realEstateListingMapper;
    private final UserRepository userRepository;
    private final RealEstateMediaService realEstateMediaService;

    @Override
    public RealEstateListingResponse createListing(RealEstateListingCreationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ánh xạ từ request sang entity RealEstateListing và liên kết user
        RealEstateListing listing = realEstateListingMapper.toRealEstateListing(request, user);
        RealEstateListing savedListing = realEstateListingRepository.save(listing);

        List<RealEstateMedia> mediaEntities = null;

        // Xử lý danh sách media nếu có
        if (request.getMediaList() != null && !request.getMediaList().isEmpty()) {
            // Lặp qua từng media request, ánh xạ và lưu vào DB
            mediaEntities = request.getMediaList().stream()
                    .map(mediaRequest -> realEstateMediaService.createMediaForListing(savedListing.getListingId(), mediaRequest))
                    .collect(Collectors.toList());
        }

        // Chuyển đổi RealEstateListing đã lưu thành response và trả về
        return realEstateListingMapper.toRealEstateListingResponse2(savedListing, mediaEntities);
    }


//    @Override
//    public RealEstateListingResponse createListing(RealEstateListingCreationRequest request) {
//        User user = userRepository.findById(request.getUserId())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//        RealEstateListing listing = realEstateListingMapper.toRealEstateListing(request, user);
//        RealEstateListing savedListing = realEstateListingRepository.save(listing);
//        return realEstateListingMapper.toRealEstateListingResponse(savedListing);
//    }

    @Override
    public List<RealEstateListingResponse> getAllListings() {
        // Lấy tất cả các listing từ cơ sở dữ liệu
        List<RealEstateListing> listings = realEstateListingRepository.findAll();

        // Chuyển đổi tất cả các listing thành RealEstateListingResponse
        List<RealEstateListingResponse> responseList = listings.stream()
                .map(realEstateListingMapper::toRealEstateListingResponse)
                .collect(Collectors.toList());

        // Duyệt qua từng listing và gán danh sách media nếu có
        for (RealEstateListingResponse response : responseList) {
            // Lấy danh sách media liên quan cho từng listing
            List<RealEstateMediaResponse> mediaList = realEstateMediaService.getMediaForListing(response.getListingId());

            // Gán mediaList vào response
            response.setMediaList(mediaList); // Gán toàn bộ danh sách media
        }

        return responseList;
    }

    @Override
    public RealEstateListingResponse getListingById(Integer listingId) {
        RealEstateListing listing = realEstateListingRepository.findById(listingId)
                .orElseThrow(() -> new AppException(ErrorCode.LISTING_NOT_FOUND));

        // Lấy danh sách media liên quan
        List<RealEstateMediaResponse> mediaList = realEstateMediaService.getMediaForListing(listingId);

        // Ánh xạ và trả về response
        RealEstateListingResponse response = realEstateListingMapper.toRealEstateListingResponse(listing);

        // Gán toàn bộ mediaList vào response
        response.setMediaList(mediaList);

        return response;
    }

    @Override
    public RealEstateListingResponse updateListing(Integer listingId, RealEstateListingUpdateRequest request) {
        // Tìm kiếm bài đăng bất động sản cần cập nhật
        RealEstateListing existingListing = realEstateListingRepository.findById(listingId)
                .orElseThrow(() -> new AppException(ErrorCode.LISTING_NOT_FOUND));

        // Cập nhật các trường được truyền vào
        if (request.getTitle() != null) {
            existingListing.setTitle(request.getTitle());
        }
        if (request.getPrice() != null) {
            existingListing.setPrice(request.getPrice());
        }
        if (request.getArea() != null) {
            existingListing.setArea(request.getArea());
        }
        if (request.getPricePerSquareMeter() != null) {
            existingListing.setPricePerSquareMeter(request.getPricePerSquareMeter());
        }
        if (request.getBedrooms() != null) {
            existingListing.setBedrooms(request.getBedrooms());
        }
        if (request.getBathrooms() != null) {
            existingListing.setBathrooms(request.getBathrooms());
        }
        if (request.getAddress() != null) {
            existingListing.setAddress(request.getAddress());
        }
        if (request.getDetailedAddress() != null) {
            existingListing.setDetailedAddress(request.getDetailedAddress());
        }
        if (request.getDescription() != null) {
            existingListing.setDescription(request.getDescription());
        }
        if (request.getContactPhoneNumber() != null) {
            existingListing.setContactPhoneNumber(request.getContactPhoneNumber());
        }

        // Cập nhật thời gian sửa đổi
        existingListing.setUpdatedAt(java.time.LocalDateTime.now());

        // Lưu lại thông tin cập nhật vào DB
        RealEstateListing updatedListing = realEstateListingRepository.save(existingListing);

        // Chuyển đổi entity thành response và trả về
        return realEstateListingMapper.toRealEstateListingResponse(updatedListing);
    }


    @Override
    public void deleteListing(Integer listingId) {
        if (!realEstateListingRepository.existsById(listingId)) {
            throw new AppException(ErrorCode.LISTING_NOT_FOUND);
        }
        realEstateListingRepository.deleteById(listingId);
    }

    @Override
    public List<RealEstateListingResponse> getListingsByType(RealEstateType realEstateType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RealEstateListing> listingsPage = realEstateListingRepository.findByRealEstateType(realEstateType, pageable);

        // Lặp qua từng listing để lấy danh sách media và gán vào response
        return listingsPage.getContent().stream()
                .map(listing -> {
                    // Lấy danh sách media cho từng listing
                    List<RealEstateMediaResponse> mediaList = realEstateMediaService.getMediaForListing(listing.getListingId());

                    // Ánh xạ RealEstateListing sang RealEstateListingResponse
                    RealEstateListingResponse response = realEstateListingMapper.toRealEstateListingResponse(listing);

                    // Gán danh sách media vào response
                    response.setMediaList(mediaList);

                    return response;
                })
                .collect(Collectors.toList());
    }


}
