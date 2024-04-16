// import { BASE_URL } from "@/app/constant/constant";


// export const confirmOrderById = async (id) => {
//     try {
//         const response = await fetch(BASE_URL+'/order/confirm/'+id, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*',
//                 'Authorization': 'Bearer '+token+'',
//             },
//         });

//         const responseData = await response.json();

//         if (response.ok) {
//             console.log(responseData);
//             return responseData;
//         } else {
//             throw new Error(responseData.message);
//         }
//     } catch (error: any) {
//         throw new Error(error.message);
//     }
// }