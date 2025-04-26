import axiosCustomize from '@/utils/axios/axios.customize';

export const CreateAccount = async (body: any) => {
  const res = await axiosCustomize.post(`/user`, body);
  return res;
};

export const paginateAccountApi = async (query: string) => {
  const res = await axiosCustomize.get(`/user/admins?${query}`);
  return res;
};
