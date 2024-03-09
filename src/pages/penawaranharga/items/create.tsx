import React, { useState } from 'react';
import Modal from '@/app/components/common/modal';
import { useRouter } from 'next/router';

const CreateItemPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        cddPrice: '',
        cddLongPrice: '',
        wingboxPrice: '',
        fusoPrice: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);
        router.push('/penawaranharga/items');
    };

    return (
        <Modal onClose={() => router.back()}>
            <form onSubmit={handleSubmit}>
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
                    type="number"
                    value={formData.cddPrice}
                    onChange={handleChange}
                    required
                />
                <br />

                <label htmlFor="cddLongPrice">Harga CDD Long:</label>
                <input
                    id="cddLongPrice"
                    name="cddLongPrice"
                    type="number"
                    value={formData.cddLongPrice}
                    onChange={handleChange}
                    required
                />
                <br />

                <label htmlFor="wingboxPrice">Harga Wingbox:</label>
                <input
                    id="wingboxPrice"
                    name="wingboxPrice"
                    type="number"
                    value={formData.wingboxPrice}
                    onChange={handleChange}
                    required
                />
                <br />

                <label htmlFor="fusoPrice">Harga Fuso:</label>
                <input
                    id="fusoPrice"
                    name="fusoPrice"
                    type="number"
                    value={formData.fusoPrice}
                    onChange={handleChange}
                    required
                />
                <br />

                <button type="submit">Simpan</button>
                <button type="button" onClick={() => router.back()}>Cancel</button>
            </form>
        </Modal>
    );
};

export default CreateItemPage;
