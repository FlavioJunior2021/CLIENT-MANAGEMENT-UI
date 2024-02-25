import { create } from 'zustand'


enum OrderStatusEnum {
	pendente = "PENDING",
	resolvido = "RESOLVED",
}

interface Order {
	id: string;
	clientId: string;
	status: OrderStatusEnum;
	description: string;
	clientName: string;
	clientPhone: string;
	createdAt: string;
}

type Orders = Order[];

interface OrdersState {
	orders: Orders;
	addOrder: (order: Order) => void;
}

// Criação do store com Zustand
export const useStore = create<OrdersState>(set => ({
	orders: [],
	addOrder: (order: Order) => set(state => ({ orders: [...state.orders, order] })),
}));
