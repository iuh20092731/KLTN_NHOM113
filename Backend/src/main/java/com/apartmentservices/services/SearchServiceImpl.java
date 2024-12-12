package com.apartmentservices.services;

import com.apartmentservices.dto.response.AdvertisementServiceResponse;
import com.apartmentservices.dto.response.MainAdvertisementResponse;
import com.apartmentservices.dto.response.SearchResponse;
import com.apartmentservices.exception.AppException;
import com.apartmentservices.exception.ErrorCode;
import com.apartmentservices.mapper.SearchMapper;
import com.apartmentservices.models.AdvertisementService;
import com.apartmentservices.models.MainAdvertisement;
import com.apartmentservices.repositories.AdvertisementServiceRepository;
import com.apartmentservices.repositories.MainAdvertisementRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class SearchServiceImpl implements SearchService {

    AdvertisementServiceRepository advertisementServiceRepository;
    MainAdvertisementRepository advertisementRepository;
    SearchMapper searchMapper;



    @Override
    public SearchResponse search(String keyword) throws AppException {
        try {
            List<AdvertisementService> services = advertisementServiceRepository.searchByKeyword(keyword);
            List<MainAdvertisement> advertisements = advertisementRepository.searchByKeyword(keyword);

            List<AdvertisementServiceResponse> serviceResponses = services.stream()
                    .map(searchMapper::toAdvertisementServiceResponse)
                    .collect(Collectors.toList());

            List<MainAdvertisementResponse> advertisementResponses = advertisements.stream()
                    .map(searchMapper::toMainAdvertisementResponse)
                    .collect(Collectors.toList());

            return SearchResponse.builder()
                    .services(serviceResponses)
                    .advertisements(advertisementResponses)
                    .build();
        } catch (Exception e) {
            // Adjusted to throw a specific AppException with an ErrorCode, without the exception cause
            throw new AppException(ErrorCode.SEARCH_FAILED);
        }
    }

}
