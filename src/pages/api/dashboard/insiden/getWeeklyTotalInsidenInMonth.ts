import { BASE_URL } from "@/app/constant/constant";

export const getWeeklyTotalInsidenInMonth = async (month: Number, year: Number): Promise<any> => {
  try {
    const response = await fetch(BASE_URL + `/insiden/total/weekly?month=${month}&year=${year}`, {
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
    var data = fetchResult.content;

    data = data.map((subArray: [any, any]) => {
      subArray[0] = subArray[0].toString();
      return subArray;
    });

    data[0] = ["Minggu ke-", "Jumlah Insiden"];

    console.log(data); // [["1", 4], ["2", 23]]
    const values = data.slice(1).map((item: [string, number]) => item[1]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const monthName = monthNames[Number(month) - 1];

    const options = {
      chart: {
        title: `Jumlah  Insiden per Minggu pada ${monthName} ${year}`,
        subtitle: "Dalam Satuan insiden",
      }

    };

    return { options, data };


  } catch (error: unknown) {
    const message = (error as Error).message || 'An unexpected error occurred';
    throw new Error(message);
  }
};
