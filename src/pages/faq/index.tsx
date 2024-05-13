import { getAllFAQ } from '@/pages/api/faq/getAllFAQ';
import { createFAQ } from '@/pages/api/faq/createFAQ';
import { deleteFAQ } from '@/pages/api/faq/deleteFAQ';
import { updateFAQ } from '@/pages/api/faq/updateFAQ';
import React, { useEffect, useState } from 'react';
import Modal from "@/app/components/common/modal";
import Drawer from "@/app/components/common/drawer";
import Footer from '@/app/components/common/footer';
import Cookies from 'js-cookie';
import router from 'next/router';

const FAQAdminPage = () => {
    const [faqs, setFAQs] = useState([]);
    const [currentFAQ, setCurrentFAQ] = useState({ id: null, question: '', answer: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteFAQId, setDeleteFAQId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    var isLoggedIn = Cookies.get('isLoggedIn');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        if (role === 'ADMIN') {
            setUserRole(role);
        } else {
            setError('You are not allowed to access this page');
        }

    }, [isLoggedIn, router])
    useEffect(() => {
        fetchFAQs();
        setUserRole(Cookies.get('role') || '');
    }, []);



    const fetchFAQs = async () => {
        try {
            const fetchedFAQs = await getAllFAQ();
            setFAQs(Array.isArray(fetchedFAQs) ? fetchedFAQs : []);
        } catch (error) {
            console.error("Failed to fetch FAQs:", error);
            setFAQs([]); // Ensure faqs is set to an empty array on failure
        }
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await updateFAQ(currentFAQ.id, currentFAQ);
        } else {
            await createFAQ(currentFAQ);
        }
        fetchFAQs();
        closeModal();
    };

    const handleEditClick = (faq) => {
        setIsEditing(true);
        setCurrentFAQ(faq);
        setShowModal(true);
    };

    const handleDeleteConfirm = (faqId) => {
        setShowDeleteModal(true);
        setDeleteFAQId(faqId);
    };

    const handleDelete = async () => {
        await deleteFAQ(deleteFAQId);
        fetchFAQs();
        setShowDeleteModal(false);
        setDeleteFAQId(null);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentFAQ(prev => ({ ...prev, [name]: value }));
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentFAQ({ id: null, question: '', answer: '' });
    };

    return (
        <>
            <Drawer userRole={userRole}>
                <div className="flex flex-col min-h-screen">
                    <main className="flex-grow flex flex-col items-center justify-start" data-theme="winter">
                        <h2 className="text-2xl font-bold my-6">Kelola FAQ</h2>
                        <button onClick={() => { setShowModal(true); setIsEditing(false); setCurrentFAQ({ id: null, question: '', answer: '' }); }} className="btn btn-primary mb-4">
                            Tambah FAQ
                        </button>
                        {showModal && (
                            <Modal onClose={closeModal} title={`${isEditing ? 'Edit' : 'Add'} FAQ`}>
                                <form onSubmit={handleFormSubmit} className="space-y-4 p-4">
                                    <h3 className="text-lg font-semibold text-gray-700">
                                        {isEditing ? 'Edit FAQ' : 'Add FAQ'}
                                    </h3>
                                    <textarea
                                        type="text"
                                        name="question"
                                        value={currentFAQ.question}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan pertanyaan FAQ"
                                        required
                                        className="p-2 border rounded w-full"
                                    />
                                    <textarea
                                        name="answer"
                                        value={currentFAQ.answer}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan jawaban FAQ"
                                        required
                                        className="p-2 border rounded w-full"
                                        rows="4"
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button type="button" onClick={closeModal} className="btn">
                                            Batal
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {isEditing ? 'Ubah' : 'Tambah'}
                                        </button>
                                    </div>
                                </form>
                            </Modal>
                        )}

                        {showDeleteModal && (
                            <Modal onClose={() => setShowDeleteModal(false)} title="Confirm Delete">
                                <div className="p-4 space-y-4">
                                    <h3 className="font-bold text-lg">Hapus</h3>
                                    <p>Apakah Anda yakin menghapus FAQ ini?</p>
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => setShowDeleteModal(false)} className="btn">
                                            Batal
                                        </button>
                                        <button onClick={handleDelete} className="btn btn-error">
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        )}
                        <div className="w-full max-w-4xl">
                            {Array.isArray(faqs) && faqs.length > 0 ? (
                                faqs.map((faq) => (
                                    <div key={faq.id} className="bg-white shadow rounded p-4 mb-4 flex justify-between items-start border-2 border-gray-150">
                                        <div>
                                            <strong className="text-lg">{faq.question}</strong>
                                            <p>{faq.answer}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEditClick(faq)} className="btn btn-success btn-sm">
                                                Ubah
                                            </button>
                                            <button onClick={() => handleDeleteConfirm(faq.id)} className="btn btn-error btn-sm">
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No FAQs available to display.</p>
                            )}
                        </div>

                    </main>
                    <Footer />
                </div>
            </Drawer>
        </>
    );
};

export default FAQAdminPage;