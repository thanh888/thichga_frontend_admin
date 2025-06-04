import axiosCustomize from '@/utils/axios/axios.customize';

export const getParamsApi = async () => {
  const res = await axiosCustomize.get(`/params-setting/only-one`);
  return res;
};
export const createParamsApi = async (formData: any) => {
  const res = await axiosCustomize.post(`/params-setting`, formData);
  return res;
};

export const UpdateParamsApi = async (formData: any) => {
  const res = await axiosCustomize.put(`/params-setting`, formData);
  return res;
};
