package com.apartmentservices.services;

import com.apartmentservices.dto.request.RealEstatePostCreationRequest;
import com.apartmentservices.dto.request.RealEstatePostUpdateRequest;
import com.apartmentservices.dto.response.PaginatedResponse;
import com.apartmentservices.dto.response.PostViewResponse;
import com.apartmentservices.dto.response.RealEstatePostResponse;

import java.util.List;

public interface RealEstatePostService {
    RealEstatePostResponse createPost(RealEstatePostCreationRequest request);
    List<RealEstatePostResponse> getAllPosts();
    RealEstatePostResponse getPostById(Integer postId);
    RealEstatePostResponse updatePost(Integer postId, RealEstatePostUpdateRequest request);
    void deletePost(Integer postId);
    List<RealEstatePostResponse> getRecentPosts(int limit);

    PaginatedResponse getPaginatedPosts(int page, int size);

    List<PostViewResponse> increaseViews(List<Integer> postIds);
}
