import axiosCustomize from '@/utils/axios/axios.customize';

export const getCountStatsApi = async () => {
  const res = await axiosCustomize.get(`/stats/count-stats`);
  return res;
};
