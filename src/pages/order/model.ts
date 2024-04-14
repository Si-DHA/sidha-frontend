
// object
export interface PurchaseOrder {
    id: string;
    createdAt: string;
    orderItems: OrderItem[];
    totalPrice: number;
    tanggalPengiriman: string;
    klien: string;
}

// object
export interface OrderItem {
    id: string;
    price: number;
    statusOrder: number;
    alasanPenolakan: string;
    isPecahBelah: boolean;
    tipeBarang: string;
    tipeTruk: string;
    keterangan: string;
    ruteOrder: Rute[];
}

// object
export interface Rute {
    id: string;
    source: string;
    destination: string;
    alamatPenjemputan: string;
    alamatPengiriman: string;
    price: number;
}
