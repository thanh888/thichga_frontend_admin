import axiosCustomize from '@/utils/axios/axios.customize';

export const paginateBetSessionApi = async (id: string, query: string) => {
  const res = await axiosCustomize.get(`/bet-session/${id}/session-by-bet?${query}`);
  return res;
};

export const findAllBetSessionApi = async () => {
  const res = await axiosCustomize.get(`/bet-session`);
  return res;
};
