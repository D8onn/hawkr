"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchFilterProps {
	onSearch: (query: string) => void;
}

export function SearchFilter({ onSearch }: SearchFilterProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value;
		setSearchQuery(query);
		onSearch(query);
	};

	const clearSearch = () => {
		setSearchQuery("");
		onSearch("");
	};

	return (
		<div className="relative">
			<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
			<Input
				type="text"
				placeholder="Search by company name..."
				value={searchQuery}
				onChange={handleSearch}
				className="pl-9 pr-9"
			/>
			{searchQuery && (
				<Button
					variant="ghost"
					size="icon"
					className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
					onClick={clearSearch}
				>
					<X className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
}
