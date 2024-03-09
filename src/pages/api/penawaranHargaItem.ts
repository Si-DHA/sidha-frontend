// api/penawaranHarga.ts
import { BASE_URL } from '@/app/constant/constant';

export const fetchPenawaranHargaItems = async (idPenawaranHarga: string): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/api/penawaran-harga-item/${idPenawaranHarga}/view-all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const updatePenawaranHargaItem = async (idPenawaranHargaItem: string, itemData: any): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/api/penawaran-harga-item/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idPenawaranHargaItem,
        ...itemData,
      }),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to update item');
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deletePenawaranHargaItem = async (idPenawaranHargaItem: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/api/penawaran-harga-item/delete/${idPenawaranHargaItem}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};
