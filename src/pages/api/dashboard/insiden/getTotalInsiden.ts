import { BASE_URL } from "@/app/constant/constant";

 export const getTotalInsiden = async (type: String): Promise<any> => {
  try {
    const response = await fetch(BASE_URL + `/insiden/total/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mengambil data insiden');
    }

    var fetchResult = await response.json();
    const numbers = fetchResult.content.map((item: [string, number]) => item[1]);
    console.log("numbers :\n" + numbers);
    var returnValue;
    if (type == "today") {
      returnValue = numbers[0];
    } else if (type == "week") {
      returnValue = numbers[1];
    } else if (type == "month") {
      returnValue = numbers[2];
    } else if (type == "year") {
      returnValue = numbers[3];
    } else {
      returnValue = fetchResult.content;
    }
    console.log("total insiden" + returnValue);
    return returnValue;



  } catch (error: unknown) {
    const message = (error as Error).message || 'An unexpected error occurred';
    throw new Error(message);
  }
};
