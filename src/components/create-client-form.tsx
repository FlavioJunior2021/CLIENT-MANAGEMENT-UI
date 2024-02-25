import { Check, Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { useState } from "react";
import { useForm } from "react-hook-form";

const clientSchema = z.object({
	name: z.string(),
	phone: z.string(),
});

type ClietSchema = z.infer<typeof clientSchema>;

export function CreateClientForm() {
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setError,
	} = useForm<ClietSchema>({
		resolver: zodResolver(clientSchema),
	});

	async function handleSubmitClient(data: ClietSchema) {
		try {
			setIsLoading(true);
			console.log(data);
			await api.post("/client", data);
			reset();
			setIsLoading(false);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			if (err.response?.data?.message) {
				setError("name", {
					type: "manual",
					message: err.response.data.message,
				});
				if (err.response?.data?.message) {
					setError("phone", {
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
		<form
			className="w-full space-y-6"
			onSubmit={handleSubmit(handleSubmitClient)}
		>
			<div className="space-y-2">
				<label className="text-sm font-medium block">
					Nome
				</label>
				<input
					className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
					{...(register("name"))}
				/>
				{errors?.name && (
					<p className="text-sm text-red-400">Cliente já cadastrado</p>
				)}
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium block">
					Telefone
				</label>
				<input
					className="border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-800/50 w-full text-sm"
					{...register("phone", {
						required: true,
						pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
					})}
				/>
				{errors?.phone && (
					<p className="text-sm text-red-400">Número já cadastrado</p>
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
