import axiosCustomize from '@/utils/axios/axios.customize';

export const createBetOption = async (formData: any) => {
  const res = await axiosCustomize.post(`/bet-option`, formData);
  return res;
};

export const paginateOptionBySessionApi = async (seesion_id: string) => {
  const res = await axiosCustomize.get(`/bet-option/${seesion_id}/find-all`);
  return res;
};
