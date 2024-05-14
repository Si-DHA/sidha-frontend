import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Order, OrderItem, Rute } from "../../../app/components/model";
import { tipeBarang, tipeTruk } from "../../../app/components/data";
import { getPossibleRute } from "@/pages/api/order/getPossibleRute";

const EditOrderItemPage = () => {
    var userId = Cookies.get('idUser');
    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
    const [possibleRute, setPossibleRute] = useState([] as string[]);
    const [error, setError] = useState('' as string);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');

        const fetchData = async () => {
            try {
                if (!userId) {
                    throw new Error('User ID not found');
                }
                const response = await getPossibleRute(userId);
                setPossibleRute(response);
            } catch (error: any) {
                setError(error.message);
            }
        }
        if (possibleRute.length === 0) {
            fetchData();
        }
    },)