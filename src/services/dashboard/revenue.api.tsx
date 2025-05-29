import axiosCustomize from '@/utils/axios/axios.customize';

export const findAllRevenueApi = async (query: string) => {
  const res = await axiosCustomize.get(`/revenue?${query}`);
  return res;
};

export const deleteRevenueById = async (id: string) => {
  const res = await axiosCustomize.delete(`/revenue/${id}`);
  return res;
};

export const paginateTotalRevenueApi = async (query: string) => {
  const res = await axiosCustomize.get(`/revenue/paginate-total?${query}`);
  return res;
};

export const paginateRevenueByDateCloseApi = async (query: string) => {
  const res = await axiosCustomize.get(`/revenue/date-close-paginate?${query}`);
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
