'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { ShieldAlert, Settings, X, Building } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminSpeedDial() {
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user || (!user.isSuperAdmin && !user.isRocoAdmin)) {
    return null;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [];

  if (user.isSuperAdmin) {
    actions.push({
      icon: <ShieldAlert size={20} color="#0f172a" />, 
      name: 'Panel Global (SuperAdmin)',
      onClick: () => {
        handleClose();
        router.push('/admin');
      }
    });
  }

  if (user.isRocoAdmin) {
    actions.push({
      icon: <Building size={20} color="#0f172a" />, 
      name: 'Gestionar mi Rocódromo',
      onClick: () => {
        handleClose();
        router.push('/admin-roco');
      }
    });
  }

  return (
    <SpeedDial
      ariaLabel="Admin SpeedDial"
      sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999 }}
      icon={<SpeedDialIcon icon={<Settings size={24} />} openIcon={<X size={24} />} />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      FabProps={{
        sx: {
          backgroundColor: '#3b82f6',
          width: '60px',
          height: '60px',
          '&:hover': {
            backgroundColor: '#2563eb',
          }
        }
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
          sx={{
            width: '48px',
            height: '48px'
          }}
        />
      ))}
    </SpeedDial>
  );
}