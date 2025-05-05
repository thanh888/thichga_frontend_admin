import axiosCustomize from '@/utils/axios/axios.customize';

export const GetSettingApi = async () => {
  try {
    const res = await axiosCustomize.get(`/setting/only-one`);
    return res;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Lỗi kết nối đến server');
  }
};

export const UpdateSettingApi = async (id: string, formData: any) => {
  try {
    const res = await axiosCustomize.put(`/setting/${id}`, formData);
    return res;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Lỗi kết nối đến server');
  }
};

export const AddBannerSettingApi = async (id: string, image: string) => {
  try {
    const res = await axiosCustomize.put(`/setting/${id}/add-banner`, { image });
    return res;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Lỗi kết nối đến server');
  }
};

export const DeleteBannerSettingApi = async (id: string, image: any) => {
  try {
    const res = await axiosCustomize.put(`/setting/${id}/delete-banner`, { image });
    return res;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Lỗi kết nối đến server');
  }
};
