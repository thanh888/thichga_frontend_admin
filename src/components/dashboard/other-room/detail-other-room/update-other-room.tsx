'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CloseOtherSession, OpenSession, UpdateBetRoomById, UpdateBettingApi } from '@/services/dashboard/bet-room.api';
import { BetResultEnum } from '@/utils/enum/bet-result.enum';
import { UrlTypeEnum } from '@/utils/enum/url-type.enum';
import { CheckFormDataNull, setFieldError } from '@/utils/functions/default-function';
import { BettingRoomInterface } from '@/utils/interfaces/bet-room.interface';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  styled,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';

import { useSocket } from '@/hooks/socket';

// Define TeamEnum
export enum TeamEnum {
  RED = 'RED',
  BLUE = 'BLUE',
}

// Styled TextareaAutosize to match OutlinedInput
const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  minHeight: '80px',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body1.fontSize,
  resize: 'vertical',
  '&:focus': {
    borderColor: theme.palette.primary.main,
    outline: `2px solid ${theme.palette.primary.main}`,
  },
  '&:hover': {
    borderColor: theme.palette.text.primary,
  },
}));

// Styled Hidden Input for file
const HiddenInput = styled('input')({
  display: 'none',
});

interface Props {
  data: BettingRoomInterface | null;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpdateOtherRoom({ data, setIsReload }: Readonly<Props>) {
  const params = useParams<{ id: string }>();
  const id = params?.id || '';

  const [formData, setFormData] = React.useState<BettingRoomInterface>({});
  const [formError, setFormError] = React.useState<any>({});
  const [openWinnerDialog, setOpenWinnerDialog] = React.useState<boolean>(false);
  const [selectResult, setSelectResult] = React.useState<string>('');
  const [isClosingSession, setIsClosingSession] = React.useState<boolean>(false); // New loading state

  const socket = useSocket();

  React.useEffect(() => {
    setFormData(data || {});
  }, [data]);

  React.useEffect(() => {
    if (data?.isAcceptBetting) {
      // gets session isOpened ==== true
    }
  }, [data?.isAcceptBetting]);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    if (name && formData) {
      setFormData((prev) => ({
        ...prev!,
        [name]: value,
      }));
      if (
        !value &&
        ['roomName', 'urlLive', 'urlType', 'fee', 'marquee', 'redName', 'blueName', 'redOdds', 'blueOdds'].includes(
          name
        )
      ) {
        setFieldError(setFormError, name, true);
      } else {
        setFieldError(setFormError, name, false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;

    const requiredFields = {
      roomName: formData.roomName,
      urlLive: formData.urlLive,
      urlType: formData.urlType,
      redName: formData.redName,
      blueName: formData.blueName,
      fee: formData.fee,
      marquee: formData.marquee,
    };
    const isNotNull = CheckFormDataNull(requiredFields, setFormError);

    if (!isNotNull) {
      toast.error('Hãy điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('roomName', formData.roomName ?? '');
      formDataToSend.append('urlLive', formData.urlLive ?? '');
      formDataToSend.append('urlType', formData.urlType ?? '');
      formDataToSend.append('fee', formData?.fee?.toString() ?? '');
      formDataToSend.append('marquee', formData.marquee ?? '');
      formDataToSend.append('redName', formData.redName ?? '');
      formDataToSend.append('blueName', formData.blueName ?? '');
      formDataToSend.append('redOdds', formData.redOdds?.toString() ?? '');
      formDataToSend.append('blueOdds', formData.blueOdds?.toString() ?? '');

      const response = await UpdateBetRoomById(id, formDataToSend);
      if (response.status === 200 || response.status === 201) {
        toast.success('Cập nhật phòng thành công');
        setIsReload(true);
        if (socket) {
          socket.emit('update-room', {
            roomID: id,
            isOpended: true,
          });
          socket.off('update-room');
        }
      } else {
        toast.error('Cập nhật phòng thất bại');
      }
    } catch (error: any) {
      console.log(error.response?.data?.message);
      if (error.response?.data?.message === 'Room name is existed') {
        toast.error('Tên phòng đã tồn tại');
      } else {
        toast.error('Đã xảy ra lỗi, vui lòng thử lại');
      }
    }
  };

  const handleOpenSession = async () => {
    if (!formData) return;
    try {
      const response = await OpenSession(id, { fee: formData.fee });
      if (response.status === 200 || response.status === 201) {
        setFormData((prev) => (prev ? { ...prev, isOpened: !prev.isOpened } : prev));
        setIsReload(true);
        toast.success(`Đã mở phiên`);
        if (socket) {
          socket.emit('update-room', {
            roomID: id,
            isOpended: true,
          });
          socket.off('update-room');
        }
      } else {
        toast.error('Cập nhật trạng thái phiên thất bại');
      }
    } catch (error) {
      console.error('Error details:', error);
      toast.error('Đã xảy ra lỗi, vui lòng thử lại');
    }
  };

  const handleCloseSession = () => {
    setOpenWinnerDialog(true); // Open the winner selection dialog
  };

  const handleConfirmCloseSession = async () => {
    if (!formData || !selectResult) return;

    setIsClosingSession(true); // Start loading
    try {
      const response = await CloseOtherSession(id, {
        latestSessionID: formData.latestSessionID,
        winner: selectResult,
        fee: formData.fee,
      });
      if (response.status === 200 || response.status === 201) {
        setFormData((prev) => (prev ? { ...prev, isOpened: !prev.isOpened } : prev));
        setIsReload(true);
        toast.success(`Đã đóng phiên với kết quả: ${selectResult}`);
        if (socket) {
          socket.emit('update-room', {
            roomID: id,
            isOpended: false,
          });
          socket.off('update-room');
        }
      } else {
        toast.error('Cập nhật trạng thái phiên thất bại');
      }
    } catch (error) {
      console.error('Error details:', error);
      toast.error('Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setIsClosingSession(false); // Stop loading
      setOpenWinnerDialog(false);
      setSelectResult('');
    }
  };

  const handleEnableBetting = async () => {
    if (!formData) return;
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('isAcceptBetting', String(true));
      formDataToSend.append('latestSessionID', String(formData.latestSessionID));
      const response = await UpdateBettingApi(id, formDataToSend);
      if (response.status === 200 || response.status === 201) {
        setFormData((prev) => (prev ? { ...prev, isAcceptBetting: !prev.isAcceptBetting } : prev));
        setIsReload(true);
        toast.success(`Đã ${formData.isAcceptBetting ? 'đóng' : 'mở'} cược`);
      } else {
        toast.error('Cập nhật trạng thái cược thất bại');
      }
    } catch (error) {
      console.error('Error details:', error);
      toast.error('Đã xảy ra lỗi, vui lòng thử lại');
    }
  };

  const handleDisableBetting = async () => {
    if (!formData) return;
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('isAcceptBetting', String(false));
      formDataToSend.append('latestSessionID', String(formData.latestSessionID));
      const response = await UpdateBettingApi(id, formDataToSend);
      if (response.status === 200 || response.status === 201) {
        setFormData((prev) => (prev ? { ...prev, isAcceptBetting: !prev.isAcceptBetting } : prev));
        setIsReload(true);
        toast.success(`Đã đóng cược`);
      } else {
        toast.error('Cập nhật trạng thái cược thất bại');
      }
    } catch (error) {
      console.error('Error details:', error);
      toast.error('Đã xảy ra lỗi, vui lòng thử lại');
    }
  };

  const renderVideoPreview = () => {
    if (!formData?.urlLive || !formData?.urlType) return null;

    if (formData.urlType === UrlTypeEnum.M3U8) {
      return (
        <video controls src={formData.urlLive} style={{ width: '100%', maxHeight: '200px', marginTop: '8px' }}>
          Your browser does not support the video tag.
        </video>
      );
    } else if (formData.urlType === UrlTypeEnum.IFRAME) {
      const embedUrl =
        formData.urlLive.includes('youtube.com') || formData.urlLive.includes('youtu.be')
          ? getYouTubeEmbedUrl(formData.urlLive)
          : formData.urlLive;
      return (
        <Box sx={{ position: 'relative', paddingTop: '56.25%', marginBottom: '16px' }}>
          <iframe
            src={embedUrl}
            title="Video Preview"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      );
    }
    return null;
  };

  const getYouTubeEmbedUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <Box sx={{ width: '100%', pt: 1, pb: 4, px: 4, borderRadius: 2, boxShadow: 5 }}>
      <Typography variant="h4" gutterBottom>
        {formData?.roomName || 'Thông tin phòng'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          {renderVideoPreview()}
          <FormControl fullWidth required>
            <InputLabel shrink>Đường dẫn live</InputLabel>
            <StyledTextarea
              name="urlLive"
              value={formData?.urlLive}
              onChange={handleChange}
              aria-label="Đường dẫn live"
              onError={formError?.urlLive ?? false}
            />
          </FormControl>
          <FormControl fullWidth required sx={{ mt: 2 }}>
            <InputLabel shrink>Loại đường dẫn</InputLabel>
            <Select
              name="urlType"
              value={formData?.urlType}
              onChange={handleChange}
              error={formError?.urlType ?? false}
            >
              <MenuItem value="">Chọn loại</MenuItem>
              <MenuItem value={UrlTypeEnum.M3U8}>M3U8</MenuItem>
              <MenuItem value={UrlTypeEnum.IFRAME}>IFRAME</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel shrink>Tên phòng</InputLabel>
            <OutlinedInput
              name="roomName"
              value={formData?.roomName}
              onChange={handleChange}
              error={formError?.roomName ?? false}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel shrink>% lãi</InputLabel>
            <OutlinedInput
              name="fee"
              value={formData?.fee}
              onChange={handleChange}
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <FormControl fullWidth>
            <InputLabel shrink>Dòng chữ chạy (marquee)</InputLabel>
            <OutlinedInput name="marquee" value={formData?.marquee} onChange={handleChange} />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel shrink>Tên đội đỏ</InputLabel>
            <OutlinedInput
              name="redName"
              value={formData?.redName}
              onChange={handleChange}
              error={formError?.redName ?? false}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel shrink>Tên đội xanh</InputLabel>
            <OutlinedInput
              name="blueName"
              value={formData?.blueName}
              onChange={handleChange}
              error={formError?.blueName ?? false}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel shrink sx={{ fontSize: 20 }}>
              Tỉ lệ gà đỏ:
            </InputLabel>
            <OutlinedInput
              name="redOdds"
              value={formData?.redOdds}
              onChange={handleChange}
              error={formError?.redOdds ?? false}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel shrink sx={{ fontSize: 20 }}>
              Tỉ lệ gà xanh:
            </InputLabel>
            <OutlinedInput
              name="blueOdds"
              value={formData?.blueOdds}
              onChange={handleChange}
              error={formError?.blueOdds ?? false}
            />
          </FormControl>
        </Grid>
        <Box sx={{ width: '100%', mt: 4, display: 'flex', gap: 2, textAlign: 'right', justifyContent: 'center' }}>
          <Button onClick={handleSubmit} variant="contained">
            Cập nhật
          </Button>
        </Box>
        <Box
          sx={{
            width: '100%',
            mt: 4,
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            textAlign: 'right',
            justifyContent: 'center',
          }}
        >
          {!formData?.isOpened ? (
            <Button onClick={handleOpenSession} variant="contained" sx={{ width: '100%' }} color={'success'}>
              {'Mở phiên'}
            </Button>
          ) : formData.isAcceptBetting ? (
            <Button onClick={handleDisableBetting} variant="outlined" sx={{ width: '100%' }} color={'error'}>
              {'Đóng cược'}
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCloseSession}
                variant="contained"
                sx={{ width: '100%' }}
                color={'error'}
                disabled={isClosingSession} // Disable button while loading
              >
                {isClosingSession ? <CircularProgress size={24} /> : 'Đóng phiên'}
              </Button>
              <Button onClick={handleEnableBetting} variant="outlined" sx={{ width: '100%' }} color={'success'}>
                {'Mở cược'}
              </Button>
            </>
          )}
        </Box>
      </Grid>

      {/* Winner Selection Dialog */}
      <Dialog
        open={openWinnerDialog}
        onClose={() => setOpenWinnerDialog(false)}
        aria-labelledby="winner-dialog-title"
        aria-describedby="winner-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="winner-dialog-title">Chọn kết quả phiên</DialogTitle>
        <DialogContent>
          <DialogContentText id="winner-dialog-description">Vui lòng chọn kết quả cho phiên này.</DialogContentText>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
            <Button
              variant={selectResult === BetResultEnum.CANCEL ? 'contained' : 'outlined'}
              color="warning"
              onClick={() => setSelectResult(BetResultEnum.CANCEL)}
              disabled={isClosingSession} // Disable buttons while loading
            >
              Hủy
            </Button>
            <Button
              variant={selectResult === BetResultEnum.DRAW ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => setSelectResult(BetResultEnum.DRAW)}
              disabled={isClosingSession} // Disable buttons while loading
            >
              Hòa
            </Button>
            <Button
              variant={selectResult === TeamEnum.RED ? 'contained' : 'outlined'}
              color="error"
              onClick={() => setSelectResult(TeamEnum.RED)}
              disabled={isClosingSession} // Disable buttons while loading
            >
              {formData?.redName || 'Đội Đỏ'}
            </Button>
            <Button
              variant={selectResult === TeamEnum.BLUE ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setSelectResult(TeamEnum.BLUE)}
              disabled={isClosingSession} // Disable buttons while loading
            >
              {formData?.blueName || 'Đội Xanh'}
            </Button>
          </Box>
          {isClosingSession && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenWinnerDialog(false)}
            color="primary"
            disabled={isClosingSession} // Disable cancel button while loading
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmCloseSession}
            color="primary"
            disabled={!selectResult || isClosingSession} // Disable confirm button while loading
            variant="contained"
            autoFocus
          >
            {isClosingSession ? <CircularProgress size={24} /> : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
