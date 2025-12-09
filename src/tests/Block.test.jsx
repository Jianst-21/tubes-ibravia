// File: src/tests/Block.test.jsx
import React from 'react'; // <--- TAMBAHKAN INI (Wajib)
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// ✅ Perbaikan 1: Import Component Utama sesuai lokasi yang kamu konfirmasi
import { Block } from "../components/PropertiesPage/Block"; 

import axios from 'axios';
import * as router from 'react-router-dom';

// --- MOCKING ---

// ✅ Perbaikan 2: Mock Component Anak (VillaButton & BlockPreview)
// Path disesuaikan: mundur dari 'tests' ke 'src', lalu masuk 'components/GlobalPage'
vi.mock('../components/GlobalPage/VillaButton', () => ({
  VillaButton: ({ name, onClick }) => <button onClick={onClick}>{name}</button>
}));

vi.mock('../components/GlobalPage/BlockPreview', () => ({
  BlockPreview: () => <div>Preview Mock</div>
}));

// Mock react-router-dom (useNavigate)
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// --- TEST SUITE (Bagian ini yang mungkin tadi hilang) ---
describe('White Box Testing - Block Component', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // JALUR 1: Initial Render & Fetching Data
  it('harus melakukan fetch data default (N001) saat pertama render', async () => {
    axios.get.mockResolvedValue({ 
      data: [{ id_block: 1, block_name: 'A1' }] 
    });

    render(<Block />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/block/N001'), 
        expect.objectContaining({ withCredentials: true })
      );
    });

    expect(await screen.findByText('Block A1')).toBeInTheDocument();
  });

  // JALUR 2: Sorting Logic
  it('harus mengurutkan block secara numerik (Logic Sorting)', async () => {
    const unsortedData = [
      { id_block: 1, block_name: 'B10' },
      { id_block: 2, block_name: 'B2' }
    ];
    axios.get.mockResolvedValue({ data: unsortedData });

    render(<Block />);

    const items = await screen.findAllByText(/Block B/);
    
    // Logic sorting: B2 harus muncul sebelum B10
    expect(items[0]).toHaveTextContent('Block B2');
    expect(items[1]).toHaveTextContent('Block B10');
  });

  // JALUR 3: Mengubah Villa (State Change)
  it('harus fetch ulang data ketika tombol Villa diganti', async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<Block />);

    const villaRayaBtn = screen.getByText('Villa Ijen Raya');
    fireEvent.click(villaRayaBtn);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/block/R001'), 
        expect.anything()
      );
    });
  });

  // JALUR 4: Pagination Logic
  it('harus menangani pagination dengan benar', async () => {
    const manyBlocks = Array.from({ length: 15 }, (_, i) => ({
      id_block: i, block_name: `C${i + 1}`
    }));
    axios.get.mockResolvedValue({ data: manyBlocks });

    render(<Block />);

    // Halaman 1 (C1 ada, C11 tidak ada)
    expect(await screen.findByText('Block C1')).toBeInTheDocument();
    expect(screen.queryByText('Block C11')).not.toBeInTheDocument();

    // Klik Next
    const buttons = screen.getAllByRole('button'); 
    const nextButton = buttons[buttons.length - 1]; 
    fireEvent.click(nextButton);

    // Halaman 2 (C11 harus ada)
    expect(await screen.findByText('Block C11')).toBeInTheDocument();
  });

  // JALUR 5: Navigasi
  it('harus navigasi ke detail page saat block diklik', async () => {
    axios.get.mockResolvedValue({ 
      data: [{ id_block: '123', block_name: 'Z99' }] 
    });

    render(<Block />);
    
    const blockCard = await screen.findByText('Block Z99');
    fireEvent.click(blockCard);

    expect(navigateMock).toHaveBeenCalledWith('/detail-properties/123');
  });

  // JALUR 6: Error Handling
  it('harus menangani error API dengan gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); 
    axios.get.mockRejectedValue(new Error('Network Error'));

    render(<Block />);

    await waitFor(() => {
        expect(screen.getByText('No blocks found for this residence.')).toBeInTheDocument();
    });
    
    expect(consoleSpy).toHaveBeenCalled();
  });

});