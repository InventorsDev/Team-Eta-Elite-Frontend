import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
	useEffect(() => {
		const timer = setTimeout(onClose, 4000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div
			className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-md text-white ${
				type === 'error' ? 'bg-red-600' : 'bg-green-600'
			}`}
		>
			{message}
		</div>
	);
}
