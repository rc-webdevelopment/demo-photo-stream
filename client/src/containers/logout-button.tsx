import React from 'react';
import styled from 'react-emotion';
import { useApolloClient } from '@apollo/client';

import { menuItemClassName } from '../components/menu-item';
import { ReactComponent as ExitIcon } from '../assets/icons/exit.svg';
import { isLoggedInVar } from '../cache';

const LogoutButton: React.FC<any> = () => {
  const client = useApolloClient();
  return (
    <StyledButton
      onClick={() => {
        client.cache.evict({ fieldName: 'me' });
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        isLoggedInVar(false);
      }}
    >
      <ExitIcon />
      Logout
    </StyledButton>
  );
}

const StyledButton = styled('button')(menuItemClassName, {
  background: 'none',
  border: 'none',
  padding: 0,
});

export default LogoutButton;