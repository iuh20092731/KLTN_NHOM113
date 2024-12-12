package com.apartmentservices.services;

import com.apartmentservices.dto.request.RealEstateMediaCreationRequest;
import com.apartmentservices.dto.response.RealEstateMediaResponse;
import com.apartmentservices.mapper.RealEstateMediaMapper;
import com.apartmentservices.models.RealEstateListing;
import com.apartmentservices.models.RealEstateMedia;
import com.apartmentservices.repositories.RealEstateListingRepository;
import com.apartmentservices.repositories.RealEstateMediaRepository;
import com.apartmentservices.services.RealEstateMediaService;
import com.apartmentservices.exception.AppException;
import com.apartmentservices.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RealEstateMediaServiceImpl implements RealEstateMediaService {

    private final RealEstateMediaRepository realEstateMediaRepository;
    private final RealEstateListingRepository realEstateListingRepository;
    private final RealEstateMediaMapper realEstateMediaMapper;



    @Override
    public RealEstateMediaResponse createMedia(Integer listingId, RealEstateMediaCreationRequest request) {
        RealEstateListing listing = realEstateListingRepository.findById(listingId)
                .orElseThrow(() -> new AppException(ErrorCode.LISTING_NOT_FOUND));

        RealEstateMedia media = realEstateMediaMapper.toRealEstateMedia(request);
        media.setRealEstateListing(listing);
        RealEstateMedia savedMedia = realEstateMediaRepository.save(media);
        return realEstateMediaMapper.toRealEstateMediaResponse(savedMedia);
    }

    @Override
    public List<RealEstateMediaResponse> getAllMediaForListing(Integer listingId) {
        return realEstateMediaRepository.findAll().stream()
                .filter(media -> media.getRealEstateListing().getListingId().equals(listingId))
                .map(realEstateMediaMapper::toRealEstateMediaResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RealEstateMediaResponse getMediaById(Integer mediaId) {
        RealEstateMedia media = realEstateMediaRepository.findById(mediaId)
                .orElseThrow(() -> new AppException(ErrorCode.MEDIA_NOT_FOUND));
        return realEstateMediaMapper.toRealEstateMediaResponse(media);
    }

    @Override
    public RealEstateMediaResponse updateMedia(Integer mediaId, RealEstateMediaCreationRequest request) {
        RealEstateMedia existingMedia = realEstateMediaRepository.findById(mediaId)
                .orElseThrow(() -> new AppException(ErrorCode.MEDIA_NOT_FOUND));

        // Update fields
        existingMedia.setMediaUrl(request.getMediaUrl());
        existingMedia.setMediaType(request.getMediaType());
        existingMedia.setSeq(request.getSeq());

        RealEstateMedia updatedMedia = realEstateMediaRepository.save(existingMedia);
        return realEstateMediaMapper.toRealEstateMediaResponse(updatedMedia);
    }

    @Override
    public void deleteMedia(Integer mediaId) {
        if (!realEstateMediaRepository.existsById(mediaId)) {
            throw new AppException(ErrorCode.MEDIA_NOT_FOUND);
        }
        realEstateMediaRepository.deleteById(mediaId);
    }

    @Override
    public List<RealEstateMediaResponse> getMediaForListing(Integer listingId) {
        List<RealEstateMedia> mediaList = realEstateMediaRepository.findRealEstateMediaByRealEstateListing(listingId);
        // Chuyển đổi từ RealEstateMedia sang RealEstateMediaResponse
        return mediaList.stream()
                .map(media -> new RealEstateMediaResponse(media)) // Sử dụng constructor của RealEstateMediaResponse
                .collect(Collectors.toList());
    }

    @Override
    public RealEstateMedia createMediaForListing(Integer listingId, RealEstateMediaCreationRequest mediaRequest) {
        // Lấy giá trị seq lớn nhất hiện tại cho listing này từ DB
        Integer maxSeq = realEstateMediaRepository.findMaxSeqByListingId(listingId);

        // Nếu seq trong yêu cầu là null, gán giá trị seq = maxSeq + 1
        Integer seq = mediaRequest.getSeq() != null ? mediaRequest.getSeq() : (maxSeq == null ? 1 : maxSeq + 1);

        // Tạo đối tượng RealEstateMedia với các giá trị từ request
        RealEstateMedia media = RealEstateMedia.builder()
                .realEstateListing(realEstateListingRepository.findById(listingId)
                        .orElseThrow(() -> new AppException(ErrorCode.LISTING_NOT_FOUND)))
                .mediaUrl(mediaRequest.getMediaUrl())
                .mediaType(mediaRequest.getMediaType())
                .seq(seq)
                .build();

        // Lưu media vào DB và trả về
        return realEstateMediaRepository.save(media);
    }

}
