import { BASE_URL } from "@/app/constant/constant";

export const getYearlyTotalNewClientInRange = async (startYear: Number, endYear: Number): Promise<any> => {
  try {
    const response = await fetch(BASE_URL + `/user/client/total/yearly?startYear=${startYear}&endYear=${endYear}`, {
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
    data = data.map((subArray: [any, any]) => {
      subArray[0] = subArray[0].toString();
      return subArray;
    });
    const values = data.slice(1).map((item: [string, number]) => item[1]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    const options = {
      chart: {
        title: `Jumlah Klien Baru Tahun ${startYear}-${endYear}`,
        subtitle: "Satuan Orang",
      }

    };
    return { options, data };

  } catch (error: unknown) {
    const message = (error as Error).message || 'An unexpected error occurred';
    throw new Error(message);
  }
};
