import type { LucideIcon } from "lucide-react";
import type { Config } from "ziggy-js";

export interface Auth {
	user: User;
}

export interface Birthday {
	name: string;
	birthday: string;
	birth_year: string;
	relationship: string;
	notes: string;
}

export interface BreadcrumbItem {
	title: string;
	href: string;
}

export interface NavGroup {
	title: string;
	items: NavItem[];
}

export interface NavItem {
	title: string;
	href: string;
	icon?: LucideIcon | null;
	isActive?: boolean;
}

export interface SharedData {
	name: string;
	quote: { message: string; author: string };
	auth: Auth;
	ziggy: Config & { location: string };
	sidebarOpen: boolean;
	[key: string]: unknown;
}

export interface RecommendedTask {
	id: number;
	task_id: number;
	title: string;
	lastCompleted: string | null;
	category: string | null;
	priority: number;
	reason: string;
	completed: boolean;
	skipped_at: string | null;
	skip_reason: string | null;
}

export interface Category {
	id: number;
	name: string;
	color: string;
	user_id: number;
}

export interface Task {
	id: number;
	title: string;
	timing_description: string;
	description: string | null;
	last_completed_at: Date | null;
	category: Category | null;
}

export interface User {
	id: number;
	name: string;
	email: string;
	avatar?: string;
	email_verified_at: string | null;
	created_at: string;
	updated_at: string;
	[key: string]: unknown;
}

export interface Paginator<T> {
	data: T[];
	current_page: number;
	from: number | null;
	last_page: number;
	links: Array<{
		url: string | null;
		label: string;
		active: boolean;
	}>;
	per_page: number;
	to: number | null;
	total: number;
	next_page_url: string | null;
	prev_page_url: string | null;
}
