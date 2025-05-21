export interface Application {
	id: number;
	company: string;
	position: string;
	date: string | null;
	notes: string | null;
	status: string;
	job_email: string | null;
	job_password: string | null;
	job_link: string | null;
	user_id: string;
}

export interface Column {
	id: string;
	title: string;
}
