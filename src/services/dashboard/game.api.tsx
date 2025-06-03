import axiosCustomize from '@/utils/axios/axios.customize';

export const findAllGameApi = async (query: string) => {
  const res = await axiosCustomize.get(`/game?${query}`);
  return res;
};

export const findGameById = async (id: string) => {
  const res = await axiosCustomize.get(`/game/${id}`);
  return res;
};

export const createGameApi = async (formData: any) => {
  const res = await axiosCustomize.post(`/game`, formData);
  return res;
};

export const updateGameById = async (id: string, formData: any) => {
  const res = await axiosCustomize.put(`/game/${id}`, formData);
  return res;
};

export const deleteGameById = async (id: string) => {
  const res = await axiosCustomize.delete(`/game/${id}`);
  return res;
};
