import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getInsidenById } from '@/pages/api/insiden/getInsidenById'
import { getBuktiFoto } from '@/pages/api/insiden/getBuktiFoto'
import Image from 'next/image';
import Navbar from "@/app/components/common/navbar";
import Footer from "@/app/components/common/footer";

const InsidenDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [insiden, setInsiden] = useState(null);
    const [buktiFotoUrl, setBuktiFotoUrl] = useState(null);

    useEffect(() => {
        if (id) {
            getInsidenById(id as string)
                .then(data => {
                    setInsiden(data);
                    if (data.buktiFoto && data.buktiFoto.id) {
                        getBuktiFoto(insiden.id)
                            .then(blob => {
                                setBuktiFotoUrl(URL.createObjectURL(blob));
                            })
                            .catch(console.error);
                    }
                })
                .catch(console.error);
        }
    }, [id]);

    if (!insiden) return <p>Loading...</p>;

    return (
      
        <div>
            <h1>Insiden Detail</h1>
            <p>Kategori: {insiden.kategori}</p>
            <p>Lokasi: {insiden.lokasi}</p>
            <p>Keterangan: {insiden.keterangan}</p>
            <p>Status: {insiden.status}</p>
            {buktiFotoUrl && (
                <div>
                    <h2>Bukti Foto:</h2>
                    <Image src={buktiFotoUrl} alt="Bukti Foto" width={500} height={300} />
                </div>
            )}
        </div>
    );
};

export default InsidenDetailPage;
