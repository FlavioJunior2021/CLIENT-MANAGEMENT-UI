/* eslint-disable @typescript-eslint/no-unused-vars */
import { Check, Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useStore } from "@/context/ordersContext";

enum StatusEnum {
	resolvido = "RESOLVED",
	pendente = "PENDING",
}

const orderSchema = z.object({
	description: z.string(),
	clientId: z.string(),
	status: z.nativeEnum(StatusEnum).default(StatusEnum.pendente),
});

type OrderSchema = z.infer<typeof orderSchema>;

interface Client {
	id: string;
	name: string;
	phone: string;
}

export function CreateOrderForm() {
	const { addOrder } = useStore();
	const [isLoading, setIsLoading] = useState(false);
	const [clients, setClients] = useState<Client[]>([]);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setError,
	} = useForm<OrderSchema>({
		resolver: zodResolver(orderSchema),
	});

	useEffect(() => {
		async function getClients() {
			const response = await api.get("/clients");
			setClients(response.data);
		}
		getClients();
	}, []);

	async function submitOrder(data: OrderSchema) {
		try {
			setIsLoading(true);
			const response = await api.post("/orders", {
				...data,
				status: "PENDING",
			});
			reset();
			setIsLoading(false);
			addOrder(response.data);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			if (err.response?.data?.message) {
				setError("description", {
					type: "manual",
					message: err.response.data.message,
				});
				if (err.response?.data?.message) {
					setError("status", {
						type: "manual",
						message: err.response.data.message,
					});
				}
			}
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<form className="w-full space-y-6" onSubmit={handleSubmit(submitOrder)}>
			<div className="space-y-2">
				<span className="text-sm font-medium block">Descrição</span>
				<textarea
					className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
					{...register("description")}
				/>
				{errors?.description && (
					<p className="text-sm text-red-400">Adicione uma descrição</p>
				)}
			</div>

			<div className="space-y-2">
				<span className="text-sm font-medium block">Cliente</span>
				<select
					className="col-span-3 h-9 bg-zinc-800 text-zinc-50 border rounded pl-2 flex justify-center"
					{...register("clientId")}
				>
					{clients?.map((client) => (
						<option value={client.id} key={client.id}>
							{client.name}
						</option>
					))}
				</select>
				{errors?.clientId && (
					<p className="text-sm text-red-400">Selecione um cliente</p>
				)}
			</div>

			<div className="flex items-center justify-end gap-2">
				<Dialog.Close asChild>
					<Button>
						<X className="size-3" />
						Cancelar
					</Button>
				</Dialog.Close>
				<Button
					className="bg-teal-400 text-teal-950"
					type="submit"
					disabled={isLoading}
				>
					{isLoading ? (
						<Loader2 className="size-3 animate-spin" />
					) : (
						<Check className="size-3" />
					)}
					Salvar
				</Button>
			</div>
		</form>
	);
}
