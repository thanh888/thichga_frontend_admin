import axiosCustomize from '@/utils/axios/axios.customize';

export const WithdrawByStatusApi = async (query: string) => {
  const res = await axiosCustomize.get(`/withdraw-history/by-status?${query}`);
  return res;
};
export const WidthdrawPaginate = async (query: string) => {
  const res = await axiosCustomize.get(`/withdraw-history/paginate?${query}`);
  return res;
};

export const updateWithdrawStatusApi = async (id: string, formData: any) => {
  const res = await axiosCustomize.put(`/withdraw-history/${id}/status`, formData);
  return res;
};
