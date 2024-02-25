import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/context/ordersContext";
import { api } from "@/lib/api";
import { Check, Loader2, MoreVertical, Trash } from "lucide-react";
import { useState } from "react";

interface OrdersActionsProps {
	orderId: string;
}

export function OrdersActions({ orderId }: OrdersActionsProps) {
	const { addOrder } = useStore();
	const [isLoading, setIsLoading] = useState(false);

	async function changeOrderStatus(orderId: string) {
		setIsLoading(true);
		const response = await api.put(`/orders/${orderId}`, {
			status: "RESOLVED",
		});
		setIsLoading(false);
		addOrder(response.data);
	}

	async function deleteOrder(orderId: string) {
		setIsLoading(true);
		const response = await api.delete(`/orders/${orderId}`);
		setIsLoading(false);
		addOrder(response.data);
	}

	return (
		<DropdownMenu key={orderId}>
			<DropdownMenuTrigger>
				{isLoading ? (
					<Loader2 className="size-3 animate-spin" />
				) : (
					<MoreVertical className="size-4 hover:text-zinc-400" />
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent className="text-zinc-50 bg-zinc-900">
				<DropdownMenuLabel>Ações</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="flex flex-row items-center gap-2"
					onClick={() => {
						changeOrderStatus(orderId);
					}}
				>
					Marcar como feito <Check className="size-3" color="green" />
				</DropdownMenuItem>
				<DropdownMenuItem
					className="flex flex-row items-center gap-2"
					onClick={() => {
						deleteOrder(orderId);
					}}
				>
					Excluir <Trash className="size-3" color="red" />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
