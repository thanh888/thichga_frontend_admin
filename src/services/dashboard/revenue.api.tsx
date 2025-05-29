import axiosCustomize from '@/utils/axios/axios.customize';

export const findAllRevenueApi = async (query: string) => {
  const res = await axiosCustomize.get(`/revenue?${query}`);
  return res;
};

export const paginateRevenueApi = async (query: string) => {
  const res = await axiosCustomize.get(`/revenue/paginate?${query}`);
  return res;
};

export const findTotalColumnRevenueApi = async (query: string) => {
  const res = await axiosCustomize.get(`/revenue/total-column-revenue?${query}`);
  return res;
};

export const findTotalLineRevenueApi = async (query: string) => {
  const res = await axiosCustomize.get(`/revenue/total-line-revenue?${query}`);
  return res;
};
