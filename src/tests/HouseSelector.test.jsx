import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import HouseSelector from '../components/DetailPage/HouseSelector'; // ⚠️ Sesuaikan path ini dengan lokasi HouseSelector.jsx kamu

// --- MOCKING ---

// 1. Mock Gambar
vi.mock('../../../src/assets/images/colection/property-page.png', () => ({
  default: 'mock-image-path.png'
}));

// 2. Mock Icon Lucide
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <button>PrevIcon</button>,
  ChevronRight: () => <button>NextIcon</button>
}));

describe('White Box Testing - HouseSelector Component', () => {
  const mockOnSelect = vi.fn();

  // Data Dummy untuk tes
  const mockHouses = [
    { id_house: 1, number_block: 'A10', status: 'available' },
    { id_house: 2, number_block: 'A2', status: 'available' }, // A2 harus sebelum A10
    { id_house: 3, number_block: 'A1', status: 'sold' },      // Sold item
    { id_house: 4, number_block: 'A3', status: 'available' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset ukuran window ke default Desktop (>1280px)
    global.innerWidth = 1440;
    global.dispatchEvent(new Event('resize'));
  });

  // JALUR 1: Rendering & Sorting Logic
  // Menguji: Logic sort((a,b) => ...)
  it('harus merender rumah dengan urutan numerik yang benar (A2 sebelum A10)', () => {
    render(
      <HouseSelector 
        houses={mockHouses} 
        selectedHouseId={null} 
        onSelect={mockOnSelect} 
      />
    );

    const buttons = screen.getAllByRole('button'); // Mengambil tombol rumah (dan chevron)
    
    // Kita cari text konten tombol rumah saja (filter yg bukan PrevIcon/NextIcon)
    const houseTexts = buttons
      .map(b => b.textContent)
      .filter(t => t.startsWith('A'));

    // Harapan: A1, A2, A3, A10 (Numeric Sort)
    expect(houseTexts).toEqual(['A1', 'A2', 'A3', 'A10']);
  });

  // JALUR 2: Interaction (Selection)
  // Menguji: onClick={() => !isSold && onSelect(house)}
  it('harus memanggil onSelect ketika rumah yang tersedia diklik', () => {
    render(
      <HouseSelector 
        houses={mockHouses} 
        selectedHouseId={null} 
        onSelect={mockOnSelect} 
      />
    );

    const houseA2 = screen.getByText('A2');
    fireEvent.click(houseA2);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(expect.objectContaining({ number_block: 'A2' }));
  });

  // JALUR 3: Logic Sold/Disabled
  // Menguji: disabled={isSold} dan styling
  it('tidak boleh diklik jika status "sold" dan style harus abu-abu', () => {
    render(
      <HouseSelector 
        houses={mockHouses} 
        selectedHouseId={null} 
        onSelect={mockOnSelect} 
      />
    );

    const houseA1 = screen.getByText('A1'); // Ini sold di mock data
    
    // Cek apakah disabled
    expect(houseA1).toBeDisabled();
    
    // Cek apakah punya class warna abu-abu (White box style check)
    expect(houseA1.className).toContain('bg-gray-700');

    // Coba klik paksa
    fireEvent.click(houseA1);
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  // JALUR 4: Active State
  // Menguji: logic isSelected ? "bg-blue-700..."
  it('harus memberikan highlight biru pada rumah yang dipilih', () => {
    render(
      <HouseSelector 
        houses={mockHouses} 
        selectedHouseId={2} // Kita pilih ID 2 (A2)
        onSelect={mockOnSelect} 
      />
    );

    const houseA2 = screen.getByText('A2');
    expect(houseA2.className).toContain('bg-blue-700');
  });

  // JALUR 5: Responsif Logic (Resize Event)
  // Menguji: useEffect resize -> updatePerPage
  it('harus mengubah jumlah item per halaman saat layar di-resize ke Mobile', () => {
    // Kita buat 10 rumah dummy
    const manyHouses = Array.from({ length: 10 }, (_, i) => ({
      id_house: i, number_block: `B${i}`, status: 'available'
    }));

    const { rerender } = render(
      <HouseSelector houses={manyHouses} selectedHouseId={null} onSelect={mockOnSelect} />
    );

    // Default Desktop (limit 20), jadi 10 rumah muncul semua
    expect(screen.getAllByText(/B\d/).length).toBe(10);

    // --- SIMULASI RESIZE KE MOBILE (<640px) ---
    act(() => {
      global.innerWidth = 500;
      global.dispatchEvent(new Event('resize'));
    });
    
    // Rerender diperlukan untuk memastikan React merespons state change akibat event listener
    rerender(<HouseSelector houses={manyHouses} selectedHouseId={null} onSelect={mockOnSelect} />);

    // Di mobile limitnya 4. Jadi harusnya cuma ada 4 rumah yang muncul
    expect(screen.getAllByText(/B\d/).length).toBe(4);
  });

  // JALUR 6: Pagination Logic
  // Menguji: slice() dan tombol Next/Prev
  it('harus menangani pagination (Next/Prev) dengan benar', () => {
    // Kita set layar Mobile (limit 4) biar gampang ngetes pagination
    global.innerWidth = 500; 
    
    // Buat 6 rumah. Halaman 1: 4 rumah, Halaman 2: 2 rumah.
    const houses = Array.from({ length: 6 }, (_, i) => ({
      id_house: i, number_block: `C${i+1}`, status: 'available'
    }));

    render(<HouseSelector houses={houses} selectedHouseId={null} onSelect={mockOnSelect} />);

    // Halaman 1: C1 - C4
    expect(screen.getByText('C1')).toBeInTheDocument();
    expect(screen.queryByText('C5')).not.toBeInTheDocument();

    // Klik Next
    const nextBtn = screen.getByText('NextIcon'); // Sesuai mock di atas
    fireEvent.click(nextBtn);

    // Halaman 2: C5 - C6
    expect(screen.getByText('C5')).toBeInTheDocument();
    expect(screen.queryByText('C1')).not.toBeInTheDocument();
  });

  // JALUR 7: Reset Page Logic
  // Menguji: useEffect(() => setCurrentPage(1), [houses])
  it('harus mereset halaman ke 1 jika data houses berubah', () => {
    global.innerWidth = 500; // Mobile limit 4
    const initialHouses = Array.from({ length: 6 }, (_, i) => ({
       id_house: i, number_block: `D${i}`, status: 'available' 
    }));

    const { rerender } = render(
      <HouseSelector houses={initialHouses} selectedHouseId={null} onSelect={mockOnSelect} />
    );

    // Pindah ke halaman 2
    fireEvent.click(screen.getByText('NextIcon'));
    expect(screen.getByText('2')).toBeInTheDocument(); // Indikator halaman

    // Ganti props houses (Filter berubah misal)
    const newHouses = [{ id_house: 99, number_block: 'Z1' }];
    rerender(
      <HouseSelector houses={newHouses} selectedHouseId={null} onSelect={mockOnSelect} />
    );

    // Harusnya balik ke halaman 1
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Z1')).toBeInTheDocument();
  });

  // JALUR 8: Empty State
  it('menampilkan pesan kosong jika tidak ada rumah', () => {
    render(<HouseSelector houses={[]} selectedHouseId={null} onSelect={mockOnSelect} />);
    expect(screen.getByText('No houses found for this block.')).toBeInTheDocument();
  });

});