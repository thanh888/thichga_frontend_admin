import axiosCustomize from '@/utils/axios/axios.customize';

export const GetSettingApi = async () => {
  try {
    const res = await axiosCustomize.get(`/setting/only-one`);
    return res;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Lỗi kết nối đến server');
  }
};

export const UpdateSettingApi = async (id: string, formData: any) => {
  try {
    const res = await axiosCustomize.put(`/setting/${id}`, formData);
    return res;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Lỗi kết nối đến server');
  }
};
