interface FormData {
    selectedCategory: string;
    selectedService: number | null;
    advertisementName: string;
    selectedDistrict: string;
    selectedWard: string;
    address: string;
    phone: string;
    // email: string;
    priceFrom: string;
    priceTo: string;
    description: string;
  }
  
  export const validateForm = (formData: FormData): Record<string, string> => {
    const errors: Record<string, string> = {};
  
    if (!formData.selectedCategory) errors.category = "Vui lòng chọn loại dịch vụ";
    if (!formData.selectedService) errors.service = "Vui lòng chọn dịch vụ";
    if (!formData.advertisementName) errors.advertisementName = "Vui lòng nhập tên cửa hàng/dịch vụ";
    if (!formData.selectedDistrict) errors.district = "Vui lòng chọn quận/huyện";
    if (!formData.selectedWard) errors.ward = "Vui lòng chọn phường";
    if (!formData.address) errors.address = "Vui lòng nhập địa chỉ";
    if (!formData.phone) errors.phone = "Vui lòng nhập số điện thoại";
    // if (!formData.email) errors.email = "Vui lòng nhập email";
    if (!formData.priceFrom) errors.priceFrom = "Vui lòng nhập mức giá thấp nhất";
    if (!formData.priceTo) errors.priceTo = "Vui lòng nhập mức giá cao nhất";
    if (!formData.description) errors.description = "Vui lòng nhập giới thiệu dịch vụ";
  
    return errors;
  };