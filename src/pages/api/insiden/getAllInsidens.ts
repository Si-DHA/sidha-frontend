import { BASE_URL } from '@/app/constant/constant';

export const getAllInsidens = async (): Promise<any> => {
    try {
        // Fetch data insiden
        const insidenResponse = await fetch(`${BASE_URL}/insiden/all`);
        const insidenData = await insidenResponse.json();

        if (!insidenResponse.ok) {
            throw new Error('Failed to fetch insiden data');
        }

        // Fetch data sopir
        const sopirResponse = await fetch(`${BASE_URL}/user/sopir`);
        const sopirData = await sopirResponse.json();

        if (!sopirResponse.ok) {
            throw new Error('Failed to fetch sopir data');
        }

        // Buat peta nama sopir dari data sopir
        const sopirMap: { [id: string]: string } = {};
        sopirData.content.forEach((sopir: any) => {
            sopirMap[sopir.id] = sopir.name;
        });

        // Tambahkan nama sopir ke setiap insiden
        const insidensWithSopirName = insidenData.map((insiden: any) => ({
            ...insiden,
            sopirName: sopirMap[insiden.id] || 'Unknown',
        }));

        return insidensWithSopirName;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
