import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// ⚠️ Pastikan path ini sesuai lokasi HouseDetail kamu (DetailPage atau PropertiesPage?)
import HouseDetail from '../components/DetailPage/HouseDetail';

// --- SOLUSI: Menggunakan vi.hoisted ---
// Variabel ini dibuat PALING PERTAMA sebelum mock apapun jalan
const globalMocks = vi.hoisted(() => {
    return {
        post: vi.fn(),
        navigate: vi.fn(),
    };
});

// 1. Mock API
// Path '../api/api' ini relatif dari file Test ini (src/tests -> src/api)
vi.mock('../api/api', () => ({
    default: {
        post: globalMocks.post, // Gunakan variabel hoisted
    },
}));

// 2. Mock React Router
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => globalMocks.navigate,
    };
});

// 3. Mock Icons & Components Lain
vi.mock('lucide-react', () => ({
    ChevronLeft: () => <button>PrevIcon</button>,
    ChevronRight: () => <button>NextIcon</button>,
    X: () => <button>CloseIcon</button>,
    Check: () => <button>CheckIcon</button>, // <--- TAMBAHKAN INI
}));

vi.mock('../../components/PopUp/PopupReservation', () => ({
    default: ({ show, onClose }) => (
        show ? <div data-testid="popup-reservation">Popup Open <button onClick={onClose}>Close</button></div> : null
    ),
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, onClick, className, ...props }) => <div className={className} onClick={onClick} {...props}>{children}</div>,
        button: ({ children, onClick, disabled, className, ...props }) => (
            <button onClick={onClick} disabled={disabled} className={className} {...props}>{children}</button>
        ),
        img: ({ src, alt, onClick, className }) => (
            <img src={src} alt={alt} onClick={onClick} className={className} />
        ),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('White Box Testing - HouseDetail Component', () => {
    const mockSetSelectedHouse = vi.fn();

    const mockHouse = {
        id_house: 101,
        id_pt: 5,
        status: 'available',
        number_block: 'A1',
        land_area: 100,
        house_area: 80,
        full_price: 500000000,
        down_payment: 50000000,
        block: {
            block_name: 'A',
            bedroom: 3,
            bathroom: 2,
            residence: {
                residence_name: 'Green Village',
                location: 'Jakarta',
            },
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        vi.spyOn(window, 'alert').mockImplementation(() => { });

        // Reset mock hoisted manual
        globalMocks.post.mockReset();
        globalMocks.navigate.mockReset();
    });

    // JALUR 1: Render Kosong
    it('menampilkan pesan "Select a house" jika props house null', () => {
        render(<HouseDetail house={null} setSelectedHouse={mockSetSelectedHouse} />);
        expect(screen.getByText('Select a house to view details')).toBeInTheDocument();
    });

    // JALUR 2: Render Info Detail
    it('menampilkan informasi detail rumah dengan benar', () => {
        render(<HouseDetail house={mockHouse} setSelectedHouse={mockSetSelectedHouse} />);
        expect(screen.getByText('Green Village')).toBeInTheDocument();
    });

    // JALUR 3: Carousel Logic
    it('navigasi carousel berfungsi (Next & Prev)', async () => {
        render(<HouseDetail house={mockHouse} setSelectedHouse={mockSetSelectedHouse} />);
        const nextBtn = screen.getByText('NextIcon');
        fireEvent.click(nextBtn);
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
    });

    // JALUR 4: Booking Validation (Belum Login)
    it('menampilkan alert dan redirect ke Login jika user belum login saat booking', () => {
        render(<HouseDetail house={mockHouse} setSelectedHouse={mockSetSelectedHouse} />);
        const bookBtn = screen.getByText('Book Now');
        fireEvent.click(bookBtn);
        expect(window.alert).toHaveBeenCalledWith("You need to log in before making a reservation.");
        expect(globalMocks.navigate).toHaveBeenCalledWith("/Login");
    });

    // JALUR 5: Booking Logic (Happy Path)
    it('berhasil melakukan booking jika user login dan data lengkap', async () => {
        const user = { id_user: 99, name: 'Test User' };
        localStorage.setItem('user', JSON.stringify(user));

        // Setup return value pada mock hoisted
        globalMocks.post.mockResolvedValue({ data: { message: 'Success' } });

        render(<HouseDetail house={mockHouse} setSelectedHouse={mockSetSelectedHouse} />);
        const bookBtn = screen.getByText('Book Now');
        fireEvent.click(bookBtn);

        await waitFor(() => {
            expect(globalMocks.post).toHaveBeenCalledWith("/reservations", {
                id_user: 99,
                id_pt: 5,
                id_house: 101,
                reservation_status: "pending",
            });
        });

        // Kita cari teks yang benar-benar muncul di layar
        expect(screen.getByText(/Your Reservation is Successful/i)).toBeInTheDocument();
        expect(mockSetSelectedHouse).toHaveBeenCalled();
    });

    // JALUR 6: Booking Error
    it('gagal booking jika data rumah tidak lengkap', () => {
        const user = { id_user: 99 };
        localStorage.setItem('user', JSON.stringify(user));

        const badHouse = { ...mockHouse, id_pt: null };
        render(<HouseDetail house={badHouse} setSelectedHouse={mockSetSelectedHouse} />);

        const bookBtn = screen.getByText('Book Now');
        fireEvent.click(bookBtn);

        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("cannot be reserved"));
        expect(globalMocks.post).not.toHaveBeenCalled();
    });

    // JALUR 7: Button States
    it('tombol disabled jika status Sold Out', () => {
        const soldHouse = { ...mockHouse, status: 'sold' };
        const { getByText } = render(<HouseDetail house={soldHouse} />);
        expect(getByText('Sold Out')).toBeDisabled();
    });

    // JALUR 8: Zoom Logic
    it('popup zoom muncul saat gambar diklik', async () => {
        render(<HouseDetail house={mockHouse} setSelectedHouse={mockSetSelectedHouse} />);
        const images = screen.getAllByRole('img');
        fireEvent.click(images[0]);
        const closeBtn = await screen.findByText('CloseIcon');
        expect(closeBtn).toBeInTheDocument();
    });
});