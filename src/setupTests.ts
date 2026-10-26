// jest-dom adds custom matchers for asserting on DOM nodes, such as
// expect(element).toBeInTheDocument().
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// GameContainer opens a socket.io connection when it is imported. Give the
// tests a stand-in socket so they never contact a real server.
vi.mock('socket.io-client', () => {
  const socket = {
    id: 'test-socket',
    connected: true,
    disconnected: false,
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connect: vi.fn(),
  };
  const io = vi.fn(() => socket);
  return { default: io, io };
});

// jsdom has no window.scrollTo; GSAP's ScrollToPlugin calls it on every
// phase change.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
