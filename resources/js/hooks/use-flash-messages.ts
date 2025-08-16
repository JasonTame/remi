import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

export const useFlashMessages = () => {
	const { flash } = usePage().props as unknown as {
		flash: { message: string; type: string };
	};

	useEffect(() => {
		if (!flash.message) return;

		if (flash.type === "success") {
			toast.success(flash.message);
		} else if (flash.type === "error") {
			toast.error(flash.message);
		} else {
			toast.info(flash.message);
		}
	}, [flash]);
};
