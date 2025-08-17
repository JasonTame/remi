import { Head, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import type { FormEventHandler } from "react";

import AuthLayout from "@/layouts/auth-layout";

import GoogleIcon from "@/components/auth/google-icon";
import InputError from "@/components/form/input-error";
import TextLink from "@/components/shared/text-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginForm = {
	email: string;
	password: string;
	remember: boolean;
};

interface LoginProps {
	status?: string;
	canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
	const { data, setData, post, processing, errors, reset } = useForm<
		Required<LoginForm>
	>({
		email: "",
		password: "",
		remember: false,
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();
		post(route("login"), {
			onFinish: () => reset("password"),
		});
	};

	return (
		<AuthLayout
			title="Log in to your account"
			subtitle="Enter your email and password below to log in"
		>
			<Head title="Log in" />

			<form className="flex flex-col gap-6" onSubmit={submit}>
				<div className="grid gap-6">
					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={() => {
							window.location.href = route("auth.google");
						}}
					>
						<GoogleIcon />
						Continue with Google
					</Button>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email address</Label>
						<Input
							id="email"
							type="email"
							required
							autoFocus
							autoComplete="email"
							value={data.email}
							onChange={(e) => setData("email", e.target.value)}
							placeholder="email@example.com"
						/>
						<InputError message={errors.email} />
					</div>

					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
							{canResetPassword && (
								<TextLink
									href={route("password.request")}
									className="ml-auto text-sm"
								>
									Forgot password?
								</TextLink>
							)}
						</div>
						<Input
							id="password"
							type="password"
							required
							autoComplete="current-password"
							value={data.password}
							onChange={(e) => setData("password", e.target.value)}
							placeholder="Password"
						/>
						<InputError message={errors.password} />
					</div>

					<div className="flex items-center space-x-3">
						<Checkbox
							id="remember"
							name="remember"
							checked={data.remember}
							onClick={() => setData("remember", !data.remember)}
						/>
						<Label htmlFor="remember">Remember me</Label>
					</div>

					<Button type="submit" className="mt-4 w-full" disabled={processing}>
						{processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
						Log in
					</Button>
				</div>

				<div className="text-muted-foreground text-center text-sm">
					Don't have an account?{" "}
					<TextLink href={route("register")}>Sign up</TextLink>
				</div>
			</form>

			{status && (
				<div className="mb-4 text-center text-sm font-medium text-green-600">
					{status}
				</div>
			)}
		</AuthLayout>
	);
}
