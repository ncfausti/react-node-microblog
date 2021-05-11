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
  const mockRouterProps = { state: '/register' };
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
    const mockPush = jest.fn().mockImplementation(() => {});
    const mockProps = { push: mockPush };
    fetch.mockResponseOnce(JSON.stringify({
      status: 'ok',
      msg: 'Login was successfull.',
    }));

    const { getByRole } = render(
      <Login.WrappedComponent location={mockProps} history={mockProps}/>,
    );
    fireEvent.click(getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });
});
