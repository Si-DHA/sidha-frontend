import { BASE_URL } from '@/app/constant/constant'; // Update with the actual path to your constants

export const getAcceptedOffersBySopir = async (sopirId: string) => {
    const response = await fetch(`${BASE_URL}/tawaran-kerja/accepted-by-sopir/${sopirId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch accepted job offers');
    }
    return response.json();
};
