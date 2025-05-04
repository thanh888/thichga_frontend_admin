import axiosCustomize from '@/utils/axios/axios.customize';

export const DepositByStatusApi = async (query: string) => {
  const res = await axiosCustomize.get(`/deposit-history/by-status?${query}`);
  return res;
};
export const paginate = async (query: string) => {
  const res = await axiosCustomize.get(`/deposit-history/paginate?${query}`);
  return res;
};
