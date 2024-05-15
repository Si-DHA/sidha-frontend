import { BASE_URL } from "@/app/constant/constant";
import exp from "constants";

export const getListCompletedOrders = async (timeRange: String): Promise<any> => {
  try {
    const response = await fetch(BASE_URL + `/order-item/orders/list?timeRange=${timeRange}&status=5`, {
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
    return fetchResult.content;


  } catch (error: unknown) {
    const message = (error as Error).message || 'An unexpected error occurred';
    throw new Error(message);
  }
};
