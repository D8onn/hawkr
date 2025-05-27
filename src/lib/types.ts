export interface Application {
	id: number | string;
	company: string;
	position: string;
	date: string | null;
	notes: string | null;
	status: string;
	application_email: string;
	application_password: string;
	application_link: string;
	user_id: string;
}

export interface Column {
	id: string;
	title: string;
}
