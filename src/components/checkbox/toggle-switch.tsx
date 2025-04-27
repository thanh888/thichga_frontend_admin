// components/ToggleSwitch.tsx
import React, { useState } from 'react';
import { styled, Switch } from '@mui/material';

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 100,
  height: 40,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(60px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#4caf50', // Green background when checked
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 36,
    height: 36,
  },
  '& .MuiSwitch-track': {
    borderRadius: 20,
    backgroundColor: '#e0e0e0', // Gray background when unchecked
    opacity: 1,
    position: 'relative',
    '&:before': {
      content: '"YES"',
      position: 'absolute',
      left: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#fff',
      fontWeight: 'bold',
    },
    '&:after': {
      content: '"NO"',
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#000',
      fontWeight: 'bold',
    },
  },
}));

export default function ToggleSwitch({
  name,
  checked,
  setChecked,
}: {
  name: string;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return <CustomSwitch checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'toggle switch' }} />;
}
