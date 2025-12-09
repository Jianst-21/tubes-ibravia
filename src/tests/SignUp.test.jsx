import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SignUp } from '../pages/SignUp'; // Pastikan path sesuai

// --- 1. SETUP HOISTED MOCKS (Jantung Kestabilan Test) ---
const { mockPost, globalMocks } = vi.hoisted(() => ({
    mockPost: vi.fn(),
    globalMocks: {
        navigate: vi.fn(),
        alert: vi.fn(), // Kita perlu mock alert browser
    }
}));

// --- 2. MOCK MODULE API ---
vi.mock('../api/api', () => ({
    default: {
        post: (...args) => mockPost(...args)
    }
}));

// --- 3. MOCK COMPONENTS & LIBS ---

// Mock PopupSignup agar mudah mendeteksi navigasi saat ditutup
vi.mock('../components/PopUp/PopupSignup', () => ({
    default: ({ show, message, onClose }) => (
        show ? (
            <div data-testid="mock-popup">
                <h1>{message?.title}</h1>
                <p>{message?.text}</p>
                {/* Tombol ini akan kita klik di test untuk simulasi close */}
                <button onClick={onClose}>Simulate Close</button>
            </div>
        ) : null
    )
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => globalMocks.navigate,
        Link: ({ to, children }) => <a href={to}>{children}</a>,
    };
});

// Mock Icons & Assets
vi.mock('react-icons/fc', () => ({ FcGoogle: () => <span>GoogleIcon</span> }));
vi.mock('lucide-react', () => ({
    Eye: () => <span data-testid="eye-icon">Eye</span>,
    EyeOff: () => <span data-testid="eye-off-icon">EyeOff</span>
}));
vi.mock('../assets/images/colection/hero-bg.jpg', () => ({ default: 'mock.jpg' }));

// Mock Env
vi.stubGlobal('import', {
    meta: { env: { VITE_API_BASE_URL: 'http://localhost:3000' } }
});

// --- SETUP & TEARDOWN ---
const originalLocation = window.location;

beforeEach(() => {
    delete window.location;
    window.location = { assign: vi.fn(), href: '' };
    window.alert = globalMocks.alert; // Mock window.alert

    vi.clearAllMocks();
    localStorage.clear();
    // Kita tidak pakai FakeTimers karena SignUp.jsx tidak pakai setTimeout yg kritikal
});

afterEach(() => {
    window.location = originalLocation;
});

// --- TEST SUITE ---

describe('White Box Testing - SignUp Component', () => {

    // TEST 1: RENDER UI
    it('merender semua elemen input form dengan benar', () => {
        render(<SignUp />);

        // Cek Judul
        expect(screen.getByText('Create Account')).toBeInTheDocument();

        // Cek Input Fields (Gunakan Placeholder atau Label)
        expect(screen.getByPlaceholderText('John')).toBeInTheDocument(); // First Name
        expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();  // Last Name
        expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();

        // Cek Password fields (ada 2 placeholder '••••••••')
        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        expect(passwordInputs).toHaveLength(2);

        // Cek Tombol Sign Up
        // Gunakan selector spesifik karena ada text "Sign Up" di link bawah juga
        const submitBtn = screen.getByRole('button', { name: /^sign up$/i });
        expect(submitBtn).toBeInTheDocument();
    });

    // TEST 2: VALIDASI INPUT (PASSWORD ERROR)
    it('menampilkan error jika password tidak memenuhi regex', () => {
        render(<SignUp />);

        const passInput = screen.getAllByPlaceholderText('••••••••')[0]; // Password field

        // Ketik password lemah (kurang dari 8 char, tidak ada angka/simbol)
        fireEvent.change(passInput, { target: { value: 'weak' } });

        // Cek pesan error muncul
        expect(screen.getByText(/Password must include minimum 8 characters/i)).toBeInTheDocument();
    });

    // TEST 3: VALIDASI INPUT (CONFIRM MISMATCH)
    it('menampilkan error jika confirm password tidak cocok', () => {
        render(<SignUp />);

        const inputs = screen.getAllByPlaceholderText('••••••••');
        const passInput = inputs[0];
        const confirmInput = inputs[1];

        fireEvent.change(passInput, { target: { value: 'Password123!' } });
        fireEvent.change(confirmInput, { target: { value: 'PasswordBeda!' } });

        // Cek pesan error muncul
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    // TEST 4: PREVENT SUBMIT JIKA KOSONG
    it('mencegah submit dan menampilkan alert jika field kosong', () => {
        render(<SignUp />);

        // Kita cari tombol submit untuk mendapatkan akses ke form-nya
        const submitBtn = screen.getByRole('button', { name: /^sign up$/i });

        // GANTI fireEvent.click MENJADI fireEvent.submit
        // fireEvent.submit akan mem-bypass validasi HTML5 'required' 
        // sehingga kita bisa mengetes logika validasi di dalam function handleSubmit
        fireEvent.submit(submitBtn.closest('form'));

        expect(globalMocks.alert).toHaveBeenCalledWith('Please fill all required fields!');
        expect(mockPost).not.toHaveBeenCalled();
    });

    // TEST 5: PREVENT SUBMIT JIKA ADA ERROR VALIDASI
    it('mencegah submit jika masih ada error validasi password', () => {
        render(<SignUp />);

        // Isi nama & email (valid)
        fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'Budi' } });
        fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Santoso' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'budi@test.com' } });

        // Isi password (INVALID - Lemah)
        const passInput = screen.getAllByPlaceholderText('••••••••')[0];
        fireEvent.change(passInput, { target: { value: 'weak' } });

        // Confirm password dibiarkan kosong (karena kita fokus ngetes error validasi password)

        // Klik Submit (PAKAI fireEvent.submit AGAR BYPASS HTML5 REQUIRED)
        const submitBtn = screen.getByRole('button', { name: /^sign up$/i });
        fireEvent.submit(submitBtn.closest('form'));

        expect(globalMocks.alert).toHaveBeenCalledWith('Please check your input!');
        expect(mockPost).not.toHaveBeenCalled();
    });

    // TEST 6: SIGNUP SUKSES (HAPPY PATH)
    it('berhasil signup, menampilkan popup, dan redirect setelah popup ditutup', async () => {
        // A. Setup Mock Sukses
        mockPost.mockResolvedValue({
            data: { message: 'OTP sent successfully' }
        });

        render(<SignUp />);

        // B. Isi Form Lengkap & Valid
        fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'User' } });
        fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Baru' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'newuser@test.com' } });

        const inputs = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(inputs[0], { target: { value: 'StrongPass123!' } });
        fireEvent.change(inputs[1], { target: { value: 'StrongPass123!' } });

        // C. Submit
        const submitBtn = screen.getByRole('button', { name: /^sign up$/i });
        fireEvent.click(submitBtn);

        // D. Tunggu API Call
        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/auth/signup', {
                name: 'User Baru',
                email: 'newuser@test.com',
                password: 'StrongPass123!'
            });
        });

        // E. Cek LocalStorage
        expect(localStorage.getItem('email')).toBe('newuser@test.com');
        expect(localStorage.getItem('otpPurpose')).toBe('signup');

        // F. Cek Popup Muncul (Mock Popup)
        expect(screen.getByTestId('mock-popup')).toBeInTheDocument();
        expect(screen.getByText('Registration Successful!')).toBeInTheDocument();

        // G. Simulasi Klik Close Popup untuk Trigger Navigate
        const closeBtn = screen.getByText('Simulate Close');
        fireEvent.click(closeBtn);

        // H. Cek Navigate
        expect(globalMocks.navigate).toHaveBeenCalledWith('/verifyotp', {
            state: { email: 'newuser@test.com', purpose: 'signup' }
        });
    });

    // TEST 7: SIGNUP GAGAL (API ERROR)
    it('menampilkan pesan error di popup jika signup gagal', async () => {
        // A. Setup Mock Error
        mockPost.mockRejectedValue({
            response: { data: { error: 'Email already exists' } }
        });

        render(<SignUp />);

        // B. Isi Form (Valid Data)
        fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'User' } });
        fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Ada' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'ada@test.com' } });

        const inputs = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(inputs[0], { target: { value: 'Pass1234!' } });
        fireEvent.change(inputs[1], { target: { value: 'Pass1234!' } });

        // C. Submit
        fireEvent.click(screen.getByRole('button', { name: /^sign up$/i }));

        // D. Tunggu Popup Error
        await waitFor(() => {
            expect(screen.getByTestId('mock-popup')).toBeInTheDocument();
            expect(screen.getByText('Failed to Register')).toBeInTheDocument();
            expect(screen.getByText('Email already exists')).toBeInTheDocument();
        });
    });

    // TEST 8: GOOGLE LOGIN
    it('tombol Google Signup mengarahkan ke URL auth', () => {
        render(<SignUp />);
        const googleBtn = screen.getByRole('button', { name: /log in with google/i }); // Text di SignUp.jsx tertulis "Log in with Google"
        fireEvent.click(googleBtn);
        expect(window.location.href).toContain('/auth/google');
    });

    // TEST 9: TOGGLE PASSWORD VISIBILITY
    it('tombol mata mengubah visibilitas password', () => {
        render(<SignUp />);
        const inputs = screen.getAllByPlaceholderText('••••••••');
        const passInput = inputs[0];

        // Cari tombol mata (pembungkus icon)
        const toggleBtns = screen.getAllByTestId('eye-icon');
        // Kita asumsikan tombol pertama adalah untuk password field pertama
        const passToggle = toggleBtns[0].closest('button');

        // Default: Password
        expect(passInput).toHaveAttribute('type', 'password');

        // Klik: Text
        fireEvent.click(passToggle);
        expect(passInput).toHaveAttribute('type', 'text');

        // Klik lagi: Password
        fireEvent.click(passToggle);
        expect(passInput).toHaveAttribute('type', 'password');
    });

});