import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
	useEffect(() => {
		const timer = setTimeout(onClose, 4000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div
			className={`fixed text-sm h-fit top-1 right-1 w-[90vw] sm:w-fit sm:top-5 sm:right-5 sm:text-base z-50 px-4 py-3 rounded-lg shadow-md text-white ${
				type === 'error' ? 'bg-red-600' : (type === "neutral" ? "bg-neutral-600" : 'bg-green-600')
			}`}
		>
			{message}
		</div>
	);
}
