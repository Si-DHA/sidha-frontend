export interface Order {
    klienId: string;
    tanggalPengiriman: string;
    orderItems: OrderItem[];
}

export interface OrderItem {
    isPecahBelah: boolean;
    tipeBarang: string;
    tipeTruk: string;
    keterangan: string;
    rute: Rute[];
}

export interface Rute {
    source: string;
    destination: string;
    alamatPengiriman: string;
    alamatPenjemputan: string;
}

export interface ConfirmOrder {
    orderId: string;
    karyawanId: string;
    orderItems: OrderItemConfirm[];
}

export interface OrderItemConfirm {
    orderItemId: string;
    isAccepted: boolean;
    rejectionReason: string;
}