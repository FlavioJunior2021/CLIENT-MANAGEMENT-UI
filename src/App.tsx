import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./components/ui/button";
import { Filter, Plus } from "lucide-react";
import { CreateClientForm } from "./components/create-client-form";
import { CreateOrderForm } from "./components/create-order-form";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./components/ui/table";
import { useEffect, useState } from "react";
import { api } from "./lib/api";
import { useStore } from "@/context/ordersContext";
import { OrdersActions } from "./components/drop-orders-actions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "./components/ui/skeleton";

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

const statusSchema = z.object({
	status: z.nativeEnum(OrderStatusEnum),
});

type StatusSchema = z.infer<typeof statusSchema>;

type Orders = Order[];

function App() {
	const { orders } = useStore();
	const [stateOrders, setOrders] = useState<Orders>();
	const [isLoading, setIsLoading] = useState(false);
	const { register, handleSubmit, reset } = useForm<StatusSchema>({
		resolver: zodResolver(statusSchema),
	});

	useEffect(() => {
		async function getOrders() {
			setIsLoading(true);
			const response = await api.get("/orders");
			setOrders(response.data);
			setIsLoading(false);
		}
		getOrders();
	}, [orders]);

	async function getOrdersByStatus(data: StatusSchema) {
		setIsLoading(true);
		const response = await api.get(`/orders/status/${data.status}`);
		setOrders(response.data);
		reset();
		setIsLoading(false);
	}

	function formatDate(formate: string) {
		const date = new Date(formate);
		const dia = date.getDate();
		const mes = date.getMonth() + 1;
		const ano = date.getFullYear(); // Ano
		const hora = date.getHours(); // Hora
		const minuto = date.getMinutes();
		const dataFormatada = `${dia}/${mes}/${ano} as ${hora}:${minuto}`;

		return dataFormatada;
	}

	return (
		<div className="py-10 space-y-8">
			<main className="max-w-6xl mx-auto space-y-5">
				<div className="flex items-center gap-3">
					<h1 className="text-xl font-bold">Cadastrar</h1>
					<Dialog.Root>
						<Dialog.Trigger asChild>
							<Button variant="primary">
								<Plus className="size-3" />
								Novo pedido
							</Button>
						</Dialog.Trigger>
						<Dialog.Portal>
							<Dialog.Overlay className="fixed inset-0 bg-black/70" />
							<Dialog.Content className="fixed space-y-10 p-10 right-0 top-0 bottom-0 h-screen min-w-[320px] z-10 bg-zinc-950 border-l border-zinc-900">
								<div className="space-y-3">
									<Dialog.Title className="text-xl font-bold">
										Criar novo pedido
									</Dialog.Title>
									<Dialog.Description className="text-sm text-zinc-500">
										Descrava quais foram os pedidos do cliente com clareza.
									</Dialog.Description>
								</div>
								<CreateOrderForm />
							</Dialog.Content>
						</Dialog.Portal>
					</Dialog.Root>
					<Dialog.Root>
						<Dialog.Trigger asChild>
							<Button variant="primary">
								<Plus className="size-3" />
								Novo cliente
							</Button>
						</Dialog.Trigger>
						<Dialog.Portal>
							<Dialog.Overlay className="fixed inset-0 bg-black/70" />
							<Dialog.Content className="fixed space-y-10 p-10 right-0 top-0 bottom-0 h-screen min-w-[320px] z-10 bg-zinc-950 border-l border-zinc-900">
								<div className="space-y-3">
									<Dialog.Title className="text-xl font-bold">
										Criar novo cliente
									</Dialog.Title>
									<Dialog.Description className="text-sm text-zinc-500">
										Adicione o nome e o telefone do cliente.
									</Dialog.Description>
								</div>
								<CreateClientForm />
							</Dialog.Content>
						</Dialog.Portal>
					</Dialog.Root>
				</div>
				<div className="flex items-center justify-between">
					<form
						className="flex items-center gap-2"
						onSubmit={handleSubmit(getOrdersByStatus)}
					>
						<select
							className="col-span-3 h-9 bg-zinc-800 text-zinc-50 border rounded pl-2 flex justify-center"
							{...register("status")}
						>
							<option value="PENDING">Pendentes</option>
							<option value="RESOLVED">Resolvidos</option>
						</select>
						<Button type="submit">
							<Filter className="size-3" />
							Filtrar
						</Button>
					</form>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Status</TableHead>
							<TableHead>Cliente</TableHead>
							<TableHead>Telefone</TableHead>
							<TableHead>Pedido</TableHead>
							<TableHead>Data</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{stateOrders?.map((order) => {
							return (
								<TableRow key={order.id}>
									<TableCell>
										{isLoading ? (
											<Skeleton className="bg-zinc-500 w-full h-2 rounded-sm" />
										) : order.status == "PENDING" ? (
											<span className="text-red-500">Pendente</span>
										) : (
											<span className="text-green-500">Resolvido</span>
										)}
									</TableCell>
									<TableCell className="text-zinc-300">
										{isLoading ? (
											<Skeleton className="bg-zinc-500 w-full h-2 rounded-sm" />
										) : (
											order.clientName
										)}
									</TableCell>
									<TableCell className="text-zinc-300">
										{isLoading ? (
											<Skeleton className="bg-zinc-500 w-full h-2 rounded-sm" />
										) : (
											order.clientPhone
										)}
									</TableCell>
									<TableCell className="text-zinc-300">
										{isLoading ? (
											<Skeleton className="bg-zinc-500 w-full h-2 rounded-sm" />
										) : (
											order.description
										)}
									</TableCell>
									<TableCell className="text-zinc-300">
										{isLoading ? (
											<Skeleton className="bg-zinc-500 w-full h-2 rounded-sm" />
										) : (
											formatDate(order.createdAt)
										)}
									</TableCell>
									<TableCell className="text-right">
										<OrdersActions orderId={order.id} key={order.id} />
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</main>
		</div>
	);
}

export default App;
