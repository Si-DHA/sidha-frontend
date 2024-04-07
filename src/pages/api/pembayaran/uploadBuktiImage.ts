import { BASE_URL } from '@/app/constant/constant';

export const uploadBuktiImage = async (
    idInvoice: string,
    isPelunasan: boolean,
    imageFile: any
): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('idInvoice', idInvoice);
        formData.append('isPelunasan', String(isPelunasan));
        formData.append('imageFile', imageFile);

        const response = await fetch(BASE_URL + '/invoice/upload-bukti', {
            method: 'POST',
            body: formData,
        });

        const responseData = await response.json();

        if (response.ok) {
            return responseData;
        } else {
            throw new Error(responseData.message);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};