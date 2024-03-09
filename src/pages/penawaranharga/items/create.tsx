import React, { useState } from 'react';
import Modal from '@/app/components/common/modal';

const CreateItemPage = () => {
  // Define the state for your form fields
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
  };

  // This page's content will be a modal with the form
  return (
    <Modal onClose={() => console.log('Modal closed')}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="source">Source:</label>
        <input
          id="source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          required
        />

        {/* Repeat for other fields like destination, cddPrice, etc. */}

        <button type="submit">Create</button>
      </form>
    </Modal>
  );
};

export default CreateItemPage;
