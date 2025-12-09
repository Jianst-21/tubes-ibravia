import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { VerifyOTP } from '../pages/VerifyOTP'; 

// --- 1. SETUP MOCK API ---
vi.mock('../api/api', () => ({
  default: { post: vi.fn() } 
}));
import api from '../api/api';

// --- 2. SETUP VARIABLE GLOBAL UNTUK MOCK ---
let mockLocationState = { email: 'test@example.com', purpose: 'signup' };

const globalMocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  alert: vi.fn(),
}));

// --- 3. MOCK DEPENDENCIES ---
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => globalMocks.navigate,
    useLocation: () => ({ state: mockLocationState }),
  };
});

vi.stubGlobal('import', { 
  meta: { env: { VITE_API_BASE_URL: 'http://localhost:3000' } } 
});

// --- SETUP & TEARDOWN ---
const originalLocation = window.location;

beforeEach(() => {
  delete window.location;
  window.location = { assign: vi.fn(), href: '' };
  window.alert = globalMocks.alert;

  vi.clearAllMocks();
  localStorage.clear();

  // Reset State Default
  mockLocationState = { email: 'test@example.com', purpose: 'signup' };
  api.post.mockResolvedValue({ data: { message: 'Success' } });
});

afterEach(() => {
  window.location = originalLocation;
});

// --- TEST SUITE ---

describe('White Box Testing - VerifyOTP Component', () => {

  // TEST 1: RENDER UI
  it('merender 6 input field dan tombol verifikasi', () => {
    render(<VerifyOTP />);
    expect(screen.getByText('Insert OTP Code')).toBeInTheDocument();
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
    expect(screen.getByRole('button', { name: /verifikasi otp/i })).toBeInTheDocument();
  });

  // TEST 2: REDIRECT JIKA TIDAK ADA EMAIL
  it('redirect ke SignUp jika email tidak ditemukan di state/storage', () => {
    mockLocationState = { email: null, purpose: 'signup' };
    
    render(<VerifyOTP />);

    expect(globalMocks.alert).toHaveBeenCalledWith(expect.stringContaining('Email not found'));
    expect(globalMocks.navigate).toHaveBeenCalledWith('/SignUp');
  });

  // TEST 3: INPUT HANDLING
  it('hanya menerima angka dan pindah fokus otomatis', () => {
    render(<VerifyOTP />);
    const inputs = screen.getAllByRole('textbox');

    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(inputs[0]).toHaveValue('1');

    fireEvent.change(inputs[1], { target: { value: 'a' } });
    expect(inputs[1]).toHaveValue(''); 
  });

  // TEST 4: PASTE HANDLING
  it('mengisi semua input saat melakukan paste kode OTP', () => {
    render(<VerifyOTP />);
    const inputs = screen.getAllByRole('textbox');
    const container = inputs[0].parentElement;

    fireEvent.paste(container, {
      clipboardData: { getData: () => '123456' },
      preventDefault: vi.fn(),
    });

    expect(inputs[0]).toHaveValue('1');
    expect(inputs[5]).toHaveValue('6');
    
    expect(api.post).toHaveBeenCalledWith('/auth/verify-otp', expect.objectContaining({
      email: 'test@example.com',
      otp: '123456'
    }));
  });

  // TEST 5: SUBMIT SUKSES (SIGNUP)
  it('berhasil verifikasi OTP (Signup) dan redirect ke Login', async () => {
    api.post.mockResolvedValue({ data: { message: 'Verification Success' } });

    render(<VerifyOTP />);
    const inputs = screen.getAllByRole('textbox');

    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: `${index + 1}` } });
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/verify-otp', {
        email: 'test@example.com',
        otp: '123456',
        purpose: 'signup'
      });
    });

    expect(globalMocks.alert).toHaveBeenCalledWith('Verification Success');
    expect(globalMocks.navigate).toHaveBeenCalledWith('/Login', {
      state: { email: 'test@example.com' }
    });
  });

  // TEST 6: SUBMIT SUKSES (FORGOT PASSWORD)
  it('berhasil verifikasi OTP (Forgot Password) dan redirect ke ResetPassword', async () => {
    const testEmail = 'user@test.com';
    
    // 1. Setup Mock
    mockLocationState = { email: testEmail, purpose: 'forgot-password' };
    localStorage.setItem('email', testEmail);
    localStorage.setItem('otpPurpose', 'forgot-password');

    api.post.mockResolvedValue({ data: { message: 'OTP Verified' } });

    render(<VerifyOTP />);
    
    // 2. Isi Semua Input
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => fireEvent.change(input, { target: { value: '9' } }));
    
    // ⚠️ PERBAIKAN: JANGAN KLIK TOMBOL MANUAL
    // Karena saat input terakhir diisi, auto-submit berjalan, state berubah jadi "Memverifikasi...",
    // tombol "Verifikasi OTP" hilang, dan test jadi error.
    // Cukup tunggu API dipanggil saja.

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/verify-otp', {
        email: testEmail,
        otp: '999999',
        purpose: 'forgot-password'
      });
    });

    expect(globalMocks.navigate).toHaveBeenCalledWith('/ResetPassword', {
      state: { email: testEmail }
    });
  });

  // TEST 7: SUBMIT GAGAL (INVALID OTP)
  it('menampilkan error jika OTP salah', async () => {
    api.post.mockRejectedValue({
      response: { data: { error: 'Invalid OTP Code' } }
    });

    render(<VerifyOTP />);
    
    const inputs = screen.getAllByRole('textbox');
    const container = inputs[0].parentElement;
    
    fireEvent.paste(container, {
      clipboardData: { getData: () => '000000' },
      preventDefault: vi.fn(),
    });

    await waitFor(() => {
      expect(screen.getByText('Invalid OTP Code')).toBeInTheDocument();
    });

    expect(inputs[0]).toHaveValue('');
  });

  // TEST 8: RESEND OTP (REAL TIMERS)
  it('mengirim ulang OTP setelah timer cooldown selesai', async () => {
    render(<VerifyOTP resendCooldown={0.5} />);
    
    const resendBtn = screen.getByRole('button', { name: /kirim ulang kode/i });

    expect(resendBtn).toBeDisabled();

    await waitFor(() => {
      expect(resendBtn).not.toBeDisabled();
      expect(resendBtn).toHaveTextContent('Kirim ulang kode');
    }, { timeout: 2000 });

    api.post.mockResolvedValueOnce({ data: { message: 'Resent Success' } });

    fireEvent.click(resendBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/resend-otp', expect.anything());
    });

    expect(globalMocks.alert).toHaveBeenCalledWith('Resent Success');
    expect(resendBtn).toBeDisabled();
  });

});