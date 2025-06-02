export default async function EmailCheck() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-2xl font-bold mb-4">Email Verification</h1>
			<p className="text-lg mb-6">
				Please check your email for a verification link to continue.
			</p>
			<p className="text-sm text-gray-500">
				If you don&apos;t see the email, please check your spam folder.
			</p>
		</div>
	);
}
