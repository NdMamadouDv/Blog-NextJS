import LoginForm from "../../components/login-form";

type LoginPageProps = {
	searchParams?: {
		callbackUrl?: string;
	};
};

export default function LoginPage({ searchParams }: LoginPageProps) {
	const callbackUrl = searchParams?.callbackUrl;
	return <LoginForm callbackUrl={callbackUrl} />;
}
