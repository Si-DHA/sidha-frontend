import { BASE_URL } from "@/app/constant/constant";


export const getMonthlyCompletedOrderInYear = async (month: Number, year: Number): Promise<any> => {
  try {
    const response = await fetch(BASE_URL + `/order-item/orders/monthly?year=${year}&status=5`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal melakukan fetch data');
    }

    var fetchResult = await response.json();
    var data = fetchResult.content;
    const values = data.slice(1).map((item: [string, number]) => item[1]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    const options = {
      chart: {
        title: `Jumlah Order Selesai per Bulan pada ${year}`,
        subtitle: "Dalam satuan order",
      }
    };
    return { options, data };


  } catch (error: unknown) {
    const message = (error as Error).message || 'An unexpected error occurred';
    throw new Error(message);
  }
};