import axiosCustomize from '@/utils/axios/axios.customize';

export const CreateAccount = async (body: any) => {
  const res = await axiosCustomize.post(`/user`, body);
  return res;
};

export const UpdateUserById = async (id: string, body: any) => {
  const res = await axiosCustomize.put(`/user/${id}`, body);
  return res;
};

export const paginateAdminApi = async (query: string) => {
  const res = await axiosCustomize.get(`/user/admins?${query}`);
  return res;
};

export const paginateUserApi = async (query: string) => {
  const res = await axiosCustomize.get(`/user/paginate?${query}`);
  return res;
};

export const getListReferralBy = async () => {
  const res = await axiosCustomize.get(`/user/referrals`);
  return res;
};

export const deleteUserById = async (id: string) => {
  const res = await axiosCustomize.delete(`/user/${id}/delete-soft`);
  return res;
};
