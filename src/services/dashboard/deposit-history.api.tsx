import axiosCustomize from '@/utils/axios/axios.customize';

export const DepositByStatusApi = async (query: string) => {
  const res = await axiosCustomize.get(`/deposit-history/by-status?${query}`);
  return res;
};
export const paginate = async (query: string) => {
  const res = await axiosCustomize.get(`/deposit-history/paginate?${query}`);
  return res;
};

export const updateDepositStatusApi = async (id: string, formData: any) => {
  const res = await axiosCustomize.put(`/deposit-history/${id}`, formData);
  return res;
};
