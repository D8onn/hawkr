"use client";

import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

			{/* Loading Content */}
			<div className="relative z-10 flex flex-col items-center space-y-4 text-white">
				<Loader2 className="h-12 w-12 animate-spin" />
				<div className="text-lg font-medium">Loading...</div>
				<div className="text-sm text-gray-300">
					Please wait while we process your request
				</div>
			</div>
		</div>
	);
}
