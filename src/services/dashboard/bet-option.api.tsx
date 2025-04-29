import axiosCustomize from '@/utils/axios/axios.customize';

export const createBetOption = async (id: string, formData: any) => {
  const res = await axiosCustomize.post(`/bet-option/${id}`);
  return res;
};
