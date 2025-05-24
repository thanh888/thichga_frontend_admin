'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { signInApi } from '@/services/auth/auth.api';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  username: zod.string().min(1, { message: 'Tên đăng nhập không được bỏ trống' }),
  password: zod.string().min(1, { message: 'Mật khẩu không được bỏ trống' }),
});

type Values = zod.infer<typeof schema>;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const { user } = useUser(); // Kiểm tra trạng thái đăng nhập
  const { checkSession } = useUser(); // Access checkSession from UserContext

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (user) {
      router.push(paths.dashboard.overview); // Redirect đến dashboard nếu đã đăng nhập
    }
  }, [user, router]);

  const onSubmit = async (data: Values) => {
    try {
      const res = (await signInApi(data)) as any;
      console.log(res);

      if (res.status === 200 || res.status === 201) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('account', res.data.accessToken);
        }
        if (checkSession) {
          await checkSession(); // Call checkSession to update user state
        }
        router.push('/');
      } else if (res?.response?.data?.message === 'Username or password is incorrect') {
        toast.error('Tài khoản hoặc mật khẩu không đúng');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error?.response?.data?.message === 'Username or password is incorrect') {
        toast.error('Tài khoản hoặc mật khẩu không đúng');
      }
    }
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Đăng nhập</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <FormControl error={!!errors.username}>
                <InputLabel>Tên đăng nhập</InputLabel>
                <OutlinedInput {...field} label="Tên đăng nhập" type="text" />
                {errors.username && <FormHelperText>{errors.username.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={!!errors.password}>
                <InputLabel>Mật khẩu</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={() => setShowPassword(true)}
                      />
                    )
                  }
                  label="Mật khẩu"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
              Quên mật khẩu?
            </Link>
          </div>
          <Button type="submit" variant="contained">
            Đăng nhập
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
