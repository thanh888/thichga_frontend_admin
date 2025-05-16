import axiosCustomize from '@/utils/axios/axios.customize';

export const CreateBetRoom = async (body: any) => {
  const res = await axiosCustomize.post(`/bet-room`, body);
  return res;
};

export const UpdateBetRoomById = async (id: string, body: any) => {
  const res = await axiosCustomize.put(`/bet-room/${id}`, body);
  return res;
};

export const OpenSession = async (id: string, body: any) => {
  const res = await axiosCustomize.put(`/bet-room/${id}/open-session`, body);
  return res;
};
export const CloseSession = async (id: string, body: any) => {
  const res = await axiosCustomize.put(`/bet-room/${id}/close-session`, body);
  return res;
};

export const EnableBetting = async (id: string, body: any) => {
  const res = await axiosCustomize.put(`/bet-room/${id}/enable-betting`, body);
  return res;
};

export const DisableBetting = async (id: string, body: any) => {
  const res = await axiosCustomize.put(`/bet-room/${id}/disable-betting`, body);
  return res;
};

export const UpdateOdds = async (id: string, body: any) => {
  const res = await axiosCustomize.put(`/bet-room/${id}/odds`, body);
  return res;
};

export const paginateBetRoomApi = async (query: string) => {
  const res = await axiosCustomize.get(`/bet-room/paginate?${query}`);
  return res;
};

export const getOneBetroomId = async (id: string) => {
  const res = await axiosCustomize.get(`/bet-room/${id}`);
  return res;
};

export const uploadImageApi = async (file: any) => {
  const res = await axiosCustomize.post(
    `/upload/file`,
    { file },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return res;
};
