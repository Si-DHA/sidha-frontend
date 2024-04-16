import { BASE_URL } from '@/app/constant/constant';

export const confirmTawaranKerja = async (tawaranKerjaId, karyawanId) => {
  try {
    const response = await fetch(`${BASE_URL}/tawaran-kerja/confirm/${tawaranKerjaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ karyawanId })
    });
    
    if (!response.ok) {
      throw new Error('Error confirming job offer');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in confirmJobOffer:', error);
    throw error;
  }
};
