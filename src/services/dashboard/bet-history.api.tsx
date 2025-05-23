import axiosCustomize from '@/utils/axios/axios.customize';

export const paginateBetHistoryApi = async (id: string, query: string) => {
  const res = await axiosCustomize.get(`/bet-history/${id}/paginate?${query}`);
  return res;
};

export const findAllBetHistoryBySessionApi = async (session_id: string, query: string) => {
  const res = await axiosCustomize.get(`/bet-history/${session_id}/by-session?${query}`);
  return res;
};
