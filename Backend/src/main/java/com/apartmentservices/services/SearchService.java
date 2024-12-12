package com.apartmentservices.services;

import com.apartmentservices.dto.response.SearchResponse;
import com.apartmentservices.exception.AppException;

public interface SearchService {

    SearchResponse search(String keyword) throws AppException;

}
