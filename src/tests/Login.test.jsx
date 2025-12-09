import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Login } from '../pages/Login'; 

// --- 1. SETUP HOISTED MOCKS ---
const { mockUserPost, mockAdminPost } = vi.hoisted(() => ({
  mockUserPost: vi.fn(),
  mockAdminPost: vi.fn(),
}));

// --- 2. MOCK MODULE API (JALUR DEBUG) ---
vi.mock('../api/api', () => ({
  default: {
    post: (...args) => mockUserPost(...args)
  }
}));

vi.mock('../api/apiadmin', () => ({
  default: {
    post: (...args) => mockAdminPost(...args)
  }
}));

// --- 3. MOCK GLOBAL LAINNYA ---
const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.stubGlobal('import', { 
  meta: { env: { VITE_API_BASE_URL: 'http://localhost:3000' } } 
});

const originalLocation = window.location;
beforeEach(() => {
  delete window.location;
  window.location = { assign: vi.fn(), href: '' };
  
  vi.clearAllMocks();
  localStorage.clear();
  // ⚠️ PENTING: Kita TIDAK pakai vi.useFakeTimers() lagi agar lebih stabil.
  // Real timers aman karena delay cuma 1 detik.

  // Default Return untuk mencegah crash
  mockUserPost.mockResolvedValue({ data: { token: 'default', user: {} } });
  mockAdminPost.mockResolvedValue({ data: { token: 'default', admin: {} } });
});

afterEach(() => {
  window.location = originalLocation;
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
    Link: ({ to, children }) => <a href={to}>{children}</a>, 
  };
});

vi.mock('react-hot-toast', () => ({
  default: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
  Toaster: () => <div data-testid="toaster" />,
}));

vi.mock('../assets/images/colection/hero-bg.jpg', () => ({ default: 'mock.jpg' }));
vi.mock('react-icons/fc', () => ({ FcGoogle: () => <span>GoogleIcon</span> }));
vi.mock('lucide-react', () => ({ 
  Eye: () => <span data-testid="eye-icon">Eye</span>,
  EyeOff: () => <span data-testid="eye-off-icon">EyeOff</span> 
}));

// --- TEST SUITE ---

describe('White Box Testing - Login Component', () => {

  it('merender form login dengan elemen input yang benar', () => {
    render(<Login />);
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    const submitBtn = screen.getByRole('button', { name: /^log in$/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it('tombol mata mengubah tipe input password (text <-> password)', () => {
    render(<Login />);
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const toggleBtn = screen.getByTestId('eye-icon').closest('button');

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('membersihkan localStorage jika admin mencoba akses halaman login', () => {
    localStorage.setItem('user', JSON.stringify({ role: 'admin' }));
    render(<Login />);
    expect(localStorage.getItem('user')).toBeNull();
  });

  // TEST 4: Login User Berhasil (REAL TIMER)
  it('berhasil login sebagai USER (email) dan redirect ke home', async () => {
    mockUserPost.mockResolvedValue({
      data: {
        token: 'user-token-123',
        user: { id: 1, name: 'User Test', email: 'user@test.com' }
      }
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'pass123' } });

    const submitBtn = screen.getByRole('button', { name: /^log in$/i });
    fireEvent.submit(submitBtn.closest('form'));

    // 1. Cek API dipanggil
    await waitFor(() => {
      expect(mockUserPost).toHaveBeenCalledWith('/auth/login', {
        identifier: 'user@test.com',
        password: 'pass123'
      });
    });

    expect(mocks.toastSuccess).toHaveBeenCalledWith('Login successful!');
    
    // 2. Tunggu Redirect (Karena ada setTimeout 1000ms di component, kita tunggu max 2000ms)
    // Kita biarkan waktu berjalan alami.
    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith('/');
    }, { timeout: 2000 }); 
  });

  // TEST 5: Login Admin Berhasil (REAL TIMER)
  it('berhasil login sebagai ADMIN (username) dan redirect ke dashboard', async () => {
    mockAdminPost.mockResolvedValue({
      data: {
        token: 'admin-token-999',
        admin: { id: 99, username: 'admin_master', email: 'admin@test.com' }
      }
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'admin_master' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'adminpass' } });

    const submitBtn = screen.getByRole('button', { name: /^log in$/i });
    fireEvent.submit(submitBtn.closest('form'));

    await waitFor(() => {
      expect(mockAdminPost).toHaveBeenCalledWith('/login', {
        identifier: 'admin_master',
        password: 'adminpass'
      });
    });

    // Tunggu redirect alami
    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith('/admin/dashboard');
    }, { timeout: 2000 });
  });

  // TEST 6: Login Gagal
  it('menampilkan pesan error jika login gagal', async () => {
    // Sembunyikan error log di terminal agar bersih
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockUserPost.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } }
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'wrong@mail.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpass' } });

    const submitBtn = screen.getByRole('button', { name: /^log in$/i });
    fireEvent.submit(submitBtn.closest('form'));

    // Tunggu Toast Error muncul
    await waitFor(() => {
      expect(mocks.toastError).toHaveBeenCalledWith('Invalid credentials');
    });

    expect(mocks.navigate).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('tombol Google Login mengarahkan ke URL auth', () => {
    render(<Login />);
    const googleBtn = screen.getByRole('button', { name: /log in with google/i });
    fireEvent.click(googleBtn);
    expect(window.location.href).toContain('/auth/google');
  });

});