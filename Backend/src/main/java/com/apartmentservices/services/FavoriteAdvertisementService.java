package com.apartmentservices.services;

import com.apartmentservices.dto.request.FavoriteAdvertisementRequest;
import com.apartmentservices.dto.response.FavoriteAdvertisementResponse;
import com.apartmentservices.dto.response.MainAdvertisementResponse;
import com.apartmentservices.mapper.FavoriteAdvertisementMapper;
import com.apartmentservices.mapper.MainAdvertisementMapper;
import com.apartmentservices.models.FavoriteAdvertisement;
import com.apartmentservices.models.MainAdvertisement;
import com.apartmentservices.repositories.FavoriteAdvertisementRepository;
import com.apartmentservices.repositories.MainAdvertisementRepository;
import com.apartmentservices.repositories.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoriteAdvertisementService {

    FavoriteAdvertisementRepository favoriteAdvertisementRepository;
    FavoriteAdvertisementMapper favoriteAdvertisementMapper;
    MainAdvertisementRepository advertisementRepository;
    MainAdvertisementMapper mainAdvertisementMapper;
    ReviewRepository reviewRepository;

//    @Transactional(readOnly = true)
//    public List<MainAdvertisementResponse> getAllAdvertisementsByFavorites(int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//
//        // Lấy danh sách favorite advertisements đã sắp xếp theo seq
//        List<FavoriteAdvertisement> favoriteAdvertisements = favoriteAdvertisementRepository.findAllByOrderBySeqAsc(pageable);
//
//        // Lấy danh sách advertisement IDs từ favorite advertisements
//        List<Integer> advertisementIds = favoriteAdvertisements.stream()
//                .map(FavoriteAdvertisement::getAdvertisementId)
//                .collect(Collectors.toList());
//
//        // Lấy danh sách advertisements dựa trên advertisement IDs
//        List<MainAdvertisement> advertisements = advertisementRepository.findByAdvertisementIdIn(advertisementIds);
//
//        // Tạo một bản đồ để lưu seq cho từng advertisementId
//        Map<Integer, Integer> seqMap = favoriteAdvertisements.stream()
//                .collect(Collectors.toMap(FavoriteAdvertisement::getAdvertisementId, FavoriteAdvertisement::getSeq));
//
//        // Chuyển đổi danh sách quảng cáo thành danh sách response DTO và sắp xếp theo seq
//        List<MainAdvertisementResponse> sortedAdvertisements = advertisements.stream()
//                .map(mainAdvertisementMapper::toMainAdvertisementResponse)
//                .sorted(Comparator.comparingInt(ad -> seqMap.getOrDefault(ad.getAdvertisementId(), Integer.MAX_VALUE))) // Sắp xếp theo seq
//                .collect(Collectors.toList());
//
//        return sortedAdvertisements;
//    }

    @Transactional(readOnly = true)
    public Page<MainAdvertisementResponse> getAllAdvertisementsByFavorites(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        // Lấy danh sách favorite advertisements đã sắp xếp theo seq với phân trang
        Page<FavoriteAdvertisement> favoriteAdvertisements = favoriteAdvertisementRepository.findAll(pageable);

        // Lấy danh sách advertisement IDs từ favorite advertisements
        List<Integer> advertisementIds = favoriteAdvertisements.stream()
                .map(FavoriteAdvertisement::getAdvertisementId)
                .toList();

        // Lấy danh sách advertisements dựa trên advertisement IDs
        List<MainAdvertisement> advertisements = advertisementRepository.findByAdvertisementIdIn(advertisementIds);

        // Tạo một bản đồ để lưu seq cho từng advertisementId
        Map<Integer, Integer> seqMap = favoriteAdvertisements.stream()
                .collect(Collectors.toMap(FavoriteAdvertisement::getAdvertisementId, FavoriteAdvertisement::getSeq));

        // Chuyển đổi danh sách quảng cáo thành danh sách response DTO và thiết lập reviewCount, averageRating
        List<MainAdvertisementResponse> sortedAdvertisements = advertisements.stream()
                .map(advertisement -> {
                    // Lấy số lượng đánh giá và đánh giá trung bình cho quảng cáo
                    Long reviewCount = reviewRepository.countByAdvertisementId(advertisement.getAdvertisementId());
                    BigDecimal averageRating = reviewRepository.findAverageRatingByAdvertisementId(advertisement.getAdvertisementId());

                    // Làm tròn averageRating đến 1 chữ số thập phân, nếu null thì sử dụng 0
                    BigDecimal roundedAverageRating = (averageRating != null)
                            ? averageRating.setScale(1, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    // Sử dụng mapper để chuyển đổi
                    MainAdvertisementResponse response = mainAdvertisementMapper.toMainAdvertisementResponse(advertisement);
                    response.setAverageRating(roundedAverageRating);
                    response.setReviewCount(reviewCount.intValue());

                    return response;
                })
                .sorted(Comparator.comparingInt(ad -> seqMap.getOrDefault(ad.getAdvertisementId(), Integer.MAX_VALUE))) // Sắp xếp theo seq
                .toList();

        // Chuyển đổi danh sách sortedAdvertisements thành Page<MainAdvertisementResponse>
        return new PageImpl<>(sortedAdvertisements, pageable, favoriteAdvertisements.getTotalElements());
    }


//    @Transactional(readOnly = true)
//    public List<MainAdvertisementResponse> getAllAdvertisementsByFavorites(int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//
//        // Lấy danh sách favorite advertisements đã sắp xếp theo seq
//        List<FavoriteAdvertisement> favoriteAdvertisements = favoriteAdvertisementRepository.findAllByOrderBySeqAsc(pageable);
//
//        // Lấy danh sách advertisement IDs từ favorite advertisements
//        List<Integer> advertisementIds = favoriteAdvertisements.stream()
//                .map(FavoriteAdvertisement::getAdvertisementId)
//                .collect(Collectors.toList());
//
//        // Lấy danh sách advertisements dựa trên advertisement IDs
//        List<MainAdvertisement> advertisements = advertisementRepository.findByAdvertisementIdIn(advertisementIds);
//
//        // Tạo một bản đồ để lưu seq cho từng advertisementId
//        Map<Integer, Integer> seqMap = favoriteAdvertisements.stream()
//                .collect(Collectors.toMap(FavoriteAdvertisement::getAdvertisementId, FavoriteAdvertisement::getSeq));
//
//        // Chuyển đổi danh sách quảng cáo thành danh sách response DTO và thiết lập reviewCount, averageRating
//        List<MainAdvertisementResponse> sortedAdvertisements = advertisements.stream()
//                .map(advertisement -> {
//                    // Lấy số lượng đánh giá và đánh giá trung bình cho quảng cáo
//                    Long reviewCount = reviewRepository.countByAdvertisementId(advertisement.getAdvertisementId());
//                    BigDecimal averageRating = reviewRepository.findAverageRatingByAdvertisementId(advertisement.getAdvertisementId());
//
//                    // Làm tròn averageRating đến 1 chữ số thập phân, nếu null thì sử dụng 0
//                    BigDecimal roundedAverageRating = (averageRating != null)
//                            ? averageRating.setScale(1, RoundingMode.HALF_UP)
//                            : BigDecimal.ZERO;
//
//                    // Sử dụng mapper để chuyển đổi
//                    MainAdvertisementResponse response = mainAdvertisementMapper.toMainAdvertisementResponse(advertisement);
//                    response.setAverageRating(roundedAverageRating);
//                    response.setReviewCount(reviewCount.intValue());
//
//                    return response;
//                })
//                .sorted(Comparator.comparingInt(ad -> seqMap.getOrDefault(ad.getAdvertisementId(), Integer.MAX_VALUE))) // Sắp xếp theo seq
//                .collect(Collectors.toList());
//
//        return sortedAdvertisements;
//    }

    @Transactional
    public FavoriteAdvertisementResponse createFavoriteAdvertisement(FavoriteAdvertisementRequest request) {
        // Lấy giá trị lớn nhất của cột `seq` từ cơ sở dữ liệu
        Integer maxSeq = favoriteAdvertisementRepository.findMaxSeq().orElse(0);

        // Tạo đối tượng FavoriteAdvertisement từ request
        FavoriteAdvertisement favoriteAdvertisement = favoriteAdvertisementMapper.toFavoriteAdvertisement(request);

        // Gán giá trị seq mới
        favoriteAdvertisement.setSeq(maxSeq + 1);

        // Lưu vào cơ sở dữ liệu
        FavoriteAdvertisement savedFavorite = favoriteAdvertisementRepository.save(favoriteAdvertisement);

        // Chuyển đổi sang response DTO
        return favoriteAdvertisementMapper.toFavoriteAdvertisementResponse(savedFavorite);
    }


    @Transactional(readOnly = true)
    public FavoriteAdvertisementResponse getFavoriteAdvertisementById(Integer favoriteId) {
        FavoriteAdvertisement favoriteAdvertisement = favoriteAdvertisementRepository.findById(favoriteId)
                .orElseThrow(() -> new IllegalArgumentException("Favorite advertisement not found"));
        return favoriteAdvertisementMapper.toFavoriteAdvertisementResponse(favoriteAdvertisement);
    }

    @Transactional(readOnly = true)
    public List<FavoriteAdvertisementResponse> getAllFavoriteAdvertisements() {
        return favoriteAdvertisementRepository.findAll().stream()
                .map(favoriteAdvertisementMapper::toFavoriteAdvertisementResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FavoriteAdvertisementResponse updateFavoriteAdvertisement(Integer favoriteId, FavoriteAdvertisementRequest request) {
        FavoriteAdvertisement existingFavorite = favoriteAdvertisementRepository.findById(favoriteId)
                .orElseThrow(() -> new IllegalArgumentException("Favorite advertisement not found"));
        favoriteAdvertisementMapper.updateFavoriteAdvertisement(existingFavorite, request);
        FavoriteAdvertisement updatedFavorite = favoriteAdvertisementRepository.save(existingFavorite);
        return favoriteAdvertisementMapper.toFavoriteAdvertisementResponse(updatedFavorite);
    }

    @Transactional
    public void deleteFavoriteAdvertisement(Integer favoriteId) {
        favoriteAdvertisementRepository.deleteById(favoriteId);
    }

    @Transactional
    public void deleteFavoriteAdvertisementByAdvertisementId(Integer advertisementId) {
        List<FavoriteAdvertisement> favoriteAdvertisements = favoriteAdvertisementRepository.findByAdvertisementId(advertisementId);
        if (favoriteAdvertisements.isEmpty()) {
            throw new IllegalArgumentException("No favorite advertisement found for advertisement ID: " + advertisementId);
        }
        favoriteAdvertisementRepository.deleteAll(favoriteAdvertisements);
    }

    @Transactional
    public FavoriteAdvertisementResponse updateFavoriteStatus(Integer favoriteId, FavoriteAdvertisement.FavoriteStatus status) {
        FavoriteAdvertisement favoriteAdvertisement = favoriteAdvertisementRepository.findById(favoriteId)
                .orElseThrow(() -> new IllegalArgumentException("Favorite advertisement not found with ID: " + favoriteId));

        // Cập nhật trạng thái
        favoriteAdvertisement.setStatus(status);

        // Lưu lại thay đổi
        FavoriteAdvertisement updatedFavorite = favoriteAdvertisementRepository.save(favoriteAdvertisement);

        // Chuyển đổi sang response DTO
        return favoriteAdvertisementMapper.toFavoriteAdvertisementResponse(updatedFavorite);
    }


}
