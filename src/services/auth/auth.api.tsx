import axiosCustomize from '@/utils/axios/axios.customize';

export const signInApi = async (formData: any) => {
  try {
    const res = await axiosCustomize.post(`/auth/sign-in-admin`, formData);

    return res;
  } catch (error: any) {
    return error;
  }
};

export const getAccoutUserApi = async () => {
  try {
    const res: any = await axiosCustomize.get(`/auth/account`);

    return res;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('Người dùng chưa đăng nhập');
    }
    throw new Error(error?.response?.data?.error || 'Lỗi kết nối đến server');
  }
};

export const SignOutApi = async () => {
  try {
    await axiosCustomize.post(`/auth/sign-out-admin`);
    return true;
  } catch (error) {
    return error;
  }
};

export const getAllUser = async () => {
  try {
    const res = await axiosCustomize.get(`/user`);

    if (res.data.EC == 0) {
      return res.data.result[0];
    }
  } catch (error) {
    return error;
  }
};
