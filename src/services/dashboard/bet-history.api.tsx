import axiosCustomize from '@/utils/axios/axios.customize';

export const findAllBetHistoryApi = async (query: string) => {
  const res = await axiosCustomize.get(`/bet-history`);
  return res;
};

export const paginateBetHistoryApi = async (id: string, query: string) => {
  const res = await axiosCustomize.get(`/bet-history/${id}/paginate?${query}`);
  return res;
};

export const paginateBetHistoryApiByUser = async (id: string, query: string) => {
  const res = await axiosCustomize.get(`/bet-history/${id}/paginate-user?${query}`);
  return res;
};

export const findAllBetHistoryBySessionApi = async (session_id: string, query: string) => {
  const res = await axiosCustomize.get(`/bet-history/${session_id}/by-session?${query}`);
  return res;
};

export const findAllBetHistoryByOptionApi = async (option_id: string, query: string) => {
  const res = await axiosCustomize.get(`/bet-history/${option_id}/by-option-exgame?${query}`);
  return res;
};
