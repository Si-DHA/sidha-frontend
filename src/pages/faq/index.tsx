import { getAllFAQ } from '@/pages/api/faq/getAllFAQ';
import { createFAQ } from '@/pages/api/faq/createFAQ';
import { deleteFAQ } from '@/pages/api/faq/deleteFAQ';
import { updateFAQ } from '@/pages/api/faq/updateFAQ';
import { updateFAQOrder } from '@/pages/api/faq/updateFAQOrder';
import React, { useEffect, useState } from 'react';
import Modal from "@/app/components/common/modal";
import Drawer from "@/app/components/common/drawer";
import Footer from '@/app/components/common/footer';
import Cookies from 'js-cookie';
import router from 'next/router';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";

const FAQAdminPage = () => {
    const [faqs, setFAQs] = useState([]);
    const [currentFAQ, setCurrentFAQ] = useState({ id: null, question: '', answer: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteFAQId, setDeleteFAQId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    const [alert, setAlert] = useState<React.ReactNode>(null);
    var isLoggedIn = Cookies.get('isLoggedIn');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
        if (role !== 'ADMIN') {
            setError('Anda tidak diperbolehkan mengakses halaman ini');
        }

    }, [isLoggedIn, router])

    useEffect(() => {
        fetchFAQs();
        setUserRole(Cookies.get('role') || '');
    }, []);


    const fetchFAQs = async () => {
        try {
            const fetchedFAQs = await getAllFAQ();
            // Urutkan faqs berdasarkan order_number
            const sortedFAQs = fetchedFAQs.sort((a, b) => a.order_number - b.order_number);
            setFAQs(sortedFAQs);
        } catch (error) {
            console.error("Failed to fetch FAQs:", error);
            setFAQs([]);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        const items = Array.from(faqs);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setFAQs(items);

        const newOrderObj = {};
        items.forEach((item, index) => {
            newOrderObj[item.id] = index;
        });

        try {
            await updateFAQOrder(newOrderObj);
            setAlert(<SuccessAlert message="Urutan FAQ berhasil diperbarui!" />);
            setTimeout(() => {
                setAlert(null);
            }, 3000);
        } catch (error) {
            console.error("Failed to update FAQ order:", error);
            setAlert(<FailAlert message="Maaf, terjadi kesalahan saat memperbarui urutan FAQ. Silakan coba lagi nanti." />);
            setTimeout(() => {
                setAlert(null);
            }, 3000);
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
            <DragDropContext onDragEnd={handleDragEnd}>
                <Drawer userRole={userRole}>
                    <div className="flex flex-col min-h-screen">
                        <main className="flex-grow flex flex-col items-center justify-start" data-theme="winter">
                        {/* {alert} */}
                            <h2 className="text-2xl font-bold my-6">Kelola FAQ</h2>
                            <button onClick={() => { setShowModal(true); setIsEditing(false); setCurrentFAQ({ id: null, question: '', answer: '' }); }} className="btn btn-primary mb-4">
                                Tambah FAQ
                            </button>
                            <p className="text-gray-500 mb-4">Seret kartu FAQ untuk mengubah urutannya. Lepaskan kartu untuk menyelesaikan.</p>
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

                            <Droppable droppableId="faq-list">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="w-full max-w-4xl"
                                    >
                                        {faqs.map((faq, index) => (
                                            <Draggable
                                                key={faq.id}
                                                draggableId={faq.id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white shadow rounded p-4 mb-4 flex justify-between items-start border-2 border-gray-150"
                                                    >
                                                        <div>
                                                            <strong className="text-lg">{faq.question}</strong>
                                                            <p>{faq.answer}</p>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleEditClick(faq)}
                                                                className="btn btn-success btn-sm"
                                                            >
                                                                Ubah
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteConfirm(faq.id)}
                                                                className="btn btn-error btn-sm"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </main>
                        <Footer />
                    </div>
                </Drawer>
            </DragDropContext>
        </>
    );

};

export default FAQAdminPage;