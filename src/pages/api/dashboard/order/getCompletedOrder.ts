import { BASE_URL } from "@/app/constant/constant";

export const getTotalCompletedOrder = async (type: String): Promise<any> => {
  try {
    const response = await fetch(BASE_URL + `/order-item/orders/completed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return 0;   
      throw new Error(errorData.message || 'Gagal mengambil data insiden');
    }

    var fetchResult = await response.json();
    var returnValue;
    if (type == "today") {
      returnValue = fetchResult.content[0][1];
    } else if (type == "week") {
      returnValue = fetchResult.content[1][1];
    } else if (type == "month") {
      returnValue = fetchResult.content[2][1];
    } else if (type == "year") {
      returnValue = fetchResult.content[3][1];
    } else {
      returnValue = fetchResult.content;
    }
    return returnValue;



  } catch (error: unknown) {
    const message = (error as Error).message || 'An unexpected error occurred';
    throw new Error(message);
  }
};
