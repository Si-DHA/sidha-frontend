import { BASE_URL } from "@/app/constant/constant";

export const getOrderByKlien = async (idUser:string, token:string): Promise<any> => {
    try {
        const response = await fetch(BASE_URL+'/order/'+idUser, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer '+token+'',
            },
        });

        const responseData = await response.json();

        if (response.ok) {
            console.log(responseData);
            var data = []
            for (let i = 0; i < responseData.content.length; i++) {
                data.push({
                    idOrder: responseData.content[i].id,
                    tanggalPemesanan: responseData.content[i].createdAt,
                    tanggalPengiriman: responseData.content[i].tanggalPengiriman,
                    jumlahOrderItem: responseData.content[i].orderItems.length,
                    totalBiayaPengiriman: responseData.content[i].totalPrice,
                });
            }
            console.log(data);
            return data;
        } else {
            throw new Error(responseData.message);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};