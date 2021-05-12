/* eslint-disable no-undef */
import React from 'react';
import {
  fireEvent, render, waitFor, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import 'isomorphic-fetch';
import fetchMock from 'jest-fetch-mock';
import Login from '../components/login';

fetchMock.enableMocks();

describe('webpage correctly handles submit & shows msg from server', () => {
  const mockPush = jest.fn().mockImplementation(() => {});
  const mockRouterProps = { state: '/register' };
  const mockProps = { push: mockPush };
  test('display error msg when server rejects this login', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      status: 'err',
      msg: '✖ Login failed: Invalid username or password provided.',
    }));
    const { getByRole } = render(<Login.WrappedComponent location={mockRouterProps}/>);
    fireEvent.click(getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('✖ Login failed: Invalid username or password provided.')).toBeInTheDocument();
    });
  });

  test('display success msg when login was ok', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      status: 'ok',
      msg: 'Login was successfull.',
    }));

    const { getByRole } = render(
      <Login.WrappedComponent location={mockRouterProps} history={mockProps}/>,
    );
    fireEvent.click(getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });
});
