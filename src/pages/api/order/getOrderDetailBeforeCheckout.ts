import { BASE_URL } from "@/app/constant/constant";
import { Order } from "@/app/components/model";

export const getOrderDetailBeforeCheckout = async (req: any, token: string) => {
    try {
        // console.log("token " + token)
        // console.log ("request body " + JSON.stringify(req))
        const response = await fetch(BASE_URL + '/order/price', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(req),
        });

        const responseData = await response.json();

        if (response.ok) {
            console.log("success ")
            var newResponse = {
                data: [] as any[],
                totalPrice: 0
            }
            var data = []
            // Tipe Barang 	Fragile 	Tipe Truk 	Rute Pegiriman 	Biaya Pengiriman 
            for (let i = 0; i < responseData.content.orderItems.length; i++) {
                var fragile = 'Tidak';
                if (responseData.content.orderItems[i].isPecahBelah) {
                    fragile = 'Ya';
                }

                var rutePengiriman = ''

                for (let j = 0; j < responseData.content.orderItems[i].rute.length; j++) {
                    rutePengiriman += responseData.content.orderItems[i].rute[j].source + ' - ' + responseData.content.orderItems[i].rute[j].destination
                    if (j < responseData.content.orderItems[i].rute.length - 1) {
                        rutePengiriman += ', '
                    }
                }

                data.push({
                    tipeBarang: responseData.content.orderItems[i].tipeBarang,
                    fragile: fragile,
                    tipeTruk: responseData.content.orderItems[i].tipeTruk,
                    rutePegiriman: rutePengiriman,
                    biayaPengiriman: responseData.content.orderItems[i].price,
                });
            }
            newResponse.data = data;
            newResponse.totalPrice = responseData.content.totalPrice;
            return newResponse;
        } else {
            console.log("failed " + responseData.message)
            throw new Error(responseData.message);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
}