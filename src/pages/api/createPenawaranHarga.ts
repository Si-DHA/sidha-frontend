// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method === 'POST') {
//         const backendBaseUrl = process.env.BACKEND_BASE_URL || 'http://localhost:8080';

//         // Step 1: Create Penawaran Harga
//         try {
//             const penawaranHargaResponse = await fetch(`${backendBaseUrl}/api/penawaran-harga/create`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(req.body.penawaranHarga),
//             });

//             if (!penawaranHargaResponse.ok) {
//                 const errorData = await penawaranHargaResponse.json();
//                 throw new Error(errorData.message || 'Failed to create Penawaran Harga');
//             }

//             const penawaranHargaData = await penawaranHargaResponse.json();

//             // Step 2: Create Penawaran Harga Item(s) using the returned ID from Penawaran Harga creation
//             const itemsPayload = req.body.items.map((item: any) => ({
//                 ...item,
//                 idPenawaranHarga: penawaranHargaData.id, // Assuming the ID is returned in the response
//             }));

//             for (const itemPayload of itemsPayload) {
//                 const itemResponse = await fetch(`${backendBaseUrl}/api/penawaran-harga-item/create`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(itemPayload),
//                 });

//                 if (!itemResponse.ok) {
//                     const errorData = await itemResponse.json();
//                     throw new Error(errorData.message || `Failed to create Penawaran Harga Item for ID ${itemPayload.idPenawaranHarga}`);
//                 }
//             }

//             // If everything is OK, return a success response
//             res.status(200).json({ message: 'Penawaran Harga and Items created successfully' });
//         } catch (error: any) {
//             // Handle errors
//             res.status(500).json({ message: error.message || 'An unexpected error occurred' });
//         }
//     } else {
//         // Handle unsupported method
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }

// pages/api/createPenawaranHarga.js
// import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(payload: any) {
    // if (req.method === 'POST') {
    //     const backendBaseUrl = process.env.BACKEND_BASE_URL || 'http://localhost:8080';

        console.log(payload);
        try {
            const response = await fetch(`http://localhost:8080/api/penawaran-harga/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create Penawaran Harga');
            }

            const data = await response.json();
            return data;
            // res.status(200).json(data);
        } catch (error: any) {
            // res.status(500).json({ message: error.message || 'An unexpected error occurred' });
            console.log(error.message);
        }
    // } else {
    //     res.setHeader('Allow', ['POST']);
    //     res.status(405).end(`Method ${req.method} Not Allowed`);
    // }
}
