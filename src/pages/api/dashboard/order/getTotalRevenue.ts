import { BASE_URL } from "@/app/constant/constant";

 export const getTotalRevenue = async (type: String): Promise<any> => {
  try {
    const response = await fetch(BASE_URL + `/order-item/revenue/total`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mengambil data pendapatan');
    }

    var fetchResult = await response.json();
    const numbers = fetchResult.content.map((item: [string, number]) => item[1]);
    var returnValue;
    if (type == "today") {
      returnValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(numbers[0]);
    } else if (type == "week") {
      returnValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(numbers[1]);
    } else if (type == "month") {
      returnValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(numbers[2]);
    } else if (type == "year") {
      returnValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(numbers[3]);
    } else {
      returnValue = fetchResult.content;
    }
    console.log("return valeu" + returnValue);
    return returnValue;



  } catch (error: unknown) {
    const message = (error as Error).message || 'An unexpected error occurred';
    throw new Error(message);
  }
};

