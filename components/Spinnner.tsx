"use client";

export default function Spinner() {
	return (
		<div
			className="flex justify-center items-center h-screen"
			role="status"
			aria-label="Loading"
		>
			<div
				className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
				aria-hidden="true"
			/>
		</div>
	);
}
