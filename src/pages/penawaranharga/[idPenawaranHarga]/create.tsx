
import React, { ChangeEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from '@/app/components/common/modal';

interface Client {
    id: string;
    penawaranHarga?: {
        idPenawaranHarga: string;
    };
}

interface FormData {
    idKlien: string;
    source: string;
    destination: string;
    cddPrice: string;
    cddLongPrice: string;
    wingboxPrice: string;
    fusoPrice: string;
}

const CreatePenawaranHargaItemPage = () => {
    const router = useRouter();
    const { idPenawaranHarga } = router.query; 
    const [formData, setFormData] = useState<FormData>({
        idKlien: '',
        source: '',
        destination: '',
        cddPrice: '',
        cddLongPrice: '',
        wingboxPrice: '',
        fusoPrice: '',
    });

    useEffect(() => {
        // Ensure idPenawaranHarga is not an array or undefined before making the fetch call
        if (typeof idPenawaranHarga === 'string') {
          fetch('/api/proxyKlien')
            .then(response => {
              if (!response.ok) {
                // If the response is not ok, throw an error to jump to the catch block
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              if (data.isSuccess && Array.isArray(data.content) && data.content.length > 0) {
                // Find the client whose penawaranHarga id matches idPenawaranHarga from the URL
                const matchingClient = data.content.find((client: Client) => 
                  client.penawaranHarga?.idPenawaranHarga === idPenawaranHarga
                );
      
                if (matchingClient) {
                  // Update the form state with the matching client's id
                  setFormData(prevState => ({
                    ...prevState,
                    idKlien: matchingClient.id,
                  }));
                } else {
                  // Handle case where no matching client is found
                  console.error('No matching client found for the given idPenawaranHarga');
                }
              } else {
                // Handle case where the response does not indicate success or contains no clients
                console.error('Response unsuccessful or contains no clients');
              }
            })
            .catch(error => {
              // Handle any errors that occur during the fetch call
              console.error('Error fetching clients:', error);
            });
        }
      }, [idPenawaranHarga]); // This will re-run when idPenawaranHarga changes      
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const bodyData = JSON.stringify({
            ...formData,
            idPenawaranHarga: idPenawaranHarga, // Assure this value is correctly set
        });

        try {
            const response = await fetch('/api/createPenawaranHargaItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: bodyData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create Penawaran Harga Item');
            }

            // Redirect to the Penawaran Harga details page
            router.push(`/penawaranharga/${idPenawaranHarga}`);
        } catch (error) {
            console.error('Error creating Penawaran Harga Item:', error);
            // Implement appropriate error handling here
        }
    };

    const handleClose = () => {
        router.back();
    };

    return (
        <Modal onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                {/* idKlien field is hidden */}
                <input
                    type="hidden"
                    name="idKlien"
                    value={formData.idKlien}
                />
                <label htmlFor="source">Source:</label>
                <input
                    id="source"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    required
                />
                <br />
                <label htmlFor="destination">Destination:</label>
                <input
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                />
                <br />
                <label htmlFor="cddPrice">Harga CDD:</label>
                <input
                    id="cddPrice"
                    name="cddPrice"
                    value={formData.cddPrice}
                    onChange={handleChange}
                    required
                />
                <br />
                <label htmlFor="cddLongPrice">Harga CDD Long:</label>
                <input
                    id="cddLongPrice"
                    name="cddLongPrice"
                    value={formData.cddLongPrice}
                    onChange={handleChange}
                    required
                />
                <br />
                <label htmlFor="wingboxPrice">Harga Wingbox:</label>
                <input
                    id="wingboxPrice"
                    name="wingboxPrice"
                    value={formData.wingboxPrice}
                    onChange={handleChange}
                    required
                />
                <br />
                <label htmlFor="fusoPrice">Harga Fuso:</label>
                <input
                    id="fusoPrice"
                    name="fusoPrice"
                    value={formData.fusoPrice}
                    onChange={handleChange}
                    required
                />
                <br />
                <button type="submit">Simpan</button>
                <button type="button" onClick={handleClose}>Cancel</button>
            </form>
        </Modal>
    );
};

export default CreatePenawaranHargaItemPage;



// import React, { useEffect, useState } from 'react';
// import Modal from '@/app/components/common/modal';
// import { useRouter } from 'next/router';

// const CreateItemPage = () => {
//     const router = useRouter();
//     const [formData, setFormData] = useState({
//         source: '',
//         destination: '',
//         cddPrice: '',
//         cddLongPrice: '',
//         wingboxPrice: '',
//         fusoPrice: '',
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         console.log('Form submitted with data:', formData);
//         router.push('/penawaranharga/items');
//     };

//     return (
//         <Modal onClose={() => router.back()}>
//             <form onSubmit={handleSubmit}>
//                 <label htmlFor="source">Source:</label>
//                 <input
//                     id="source"
//                     name="source"
//                     value={formData.source}
//                     onChange={handleChange}
//                     required
//                 />
//                 <br />

//                 <label htmlFor="destination">Destination:</label>
//                 <input
//                     id="destination"
//                     name="destination"
//                     value={formData.destination}
//                     onChange={handleChange}
//                     required
//                 />
//                 <br />

//                 <label htmlFor="cddPrice">Harga CDD:</label>
//                 <input
//                     id="cddPrice"
//                     name="cddPrice"
//                     type="number"
//                     value={formData.cddPrice}
//                     onChange={handleChange}
//                     required
//                 />
//                 <br />

//                 <label htmlFor="cddLongPrice">Harga CDD Long:</label>
//                 <input
//                     id="cddLongPrice"
//                     name="cddLongPrice"
//                     type="number"
//                     value={formData.cddLongPrice}
//                     onChange={handleChange}
//                     required
//                 />
//                 <br />

//                 <label htmlFor="wingboxPrice">Harga Wingbox:</label>
//                 <input
//                     id="wingboxPrice"
//                     name="wingboxPrice"
//                     type="number"
//                     value={formData.wingboxPrice}
//                     onChange={handleChange}
//                     required
//                 />
//                 <br />

//                 <label htmlFor="fusoPrice">Harga Fuso:</label>
//                 <input
//                     id="fusoPrice"
//                     name="fusoPrice"
//                     type="number"
//                     value={formData.fusoPrice}
//                     onChange={handleChange}
//                     required
//                 />
//                 <br />

//                 <button type="submit">Simpan</button>
//                 <button type="button" onClick={() => router.back()}>Cancel</button>
//             </form>
//         </Modal>
//     );
// };

// export default CreateItemPage;
