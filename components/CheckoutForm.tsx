import { useState } from "react";
import { PaymentElement, useCheckout, StripeCheckoutValue, StripeUseCheckoutResult, ShippingAddressElement } from "@stripe/react-stripe-js/checkout";

const validateEmail = async ({ email, checkout }: { email: string, checkout: StripeCheckoutValue }) => {
	const updateResult = await checkout.updateEmail(email);
	const isValid = updateResult.type !== "error";
	return { isValid, message: !isValid ? updateResult.error.message : null };
};

const EmailForm = ({ email, setEmail, error, setError, checkout }: { email: string; setEmail: (email: string) => void; error: string | null; setError: (error: string | null) => void; checkout: StripeCheckoutValue }) => {

	const handleEmailBlur = async () => {
		if (!email) {
			return;
		}

		const { isValid, message } = await validateEmail({ email, checkout });
		if (!isValid) {
			setError(message);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setError(null);
		setEmail(e.target.value);
	};

	return (
		<div id="email-form" className="flex flex-col space-y-4">
			<label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
			<input type="text" id="email" name="email" value={email} onChange={handleChange} onBlur={handleEmailBlur} className="border border-gray-300 rounded-md p-4 w-full focus:outline-none focus:border-black focus:ring-1 focus:ring-black"/>
			{error && <div className="mt-2 text-red-600">{error}</div>}
		</div>
	);
}

const CheckoutForm = () => {
	const [message, setMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	const checkoutState: StripeUseCheckoutResult = useCheckout();
	if (checkoutState.type === "loading") {
		return <div>Loading checkout...</div>;
	}
	if (checkoutState.type === "error") {
		return <div>Error: {checkoutState.error.message}</div>;
	}

	const handlePlacingOrder = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const { checkout } = checkoutState;
		setIsLoading(true);

		const { isValid, message: validationMessage } = await validateEmail({ email: checkout.email || "", checkout });

		if (!isValid) {
			setMessage(validationMessage);
			setIsLoading(false);
			return;
		}

		const confirmResult = await checkout.confirm();

		if (confirmResult.type === "error") {
			setMessage(confirmResult.error.message);
		}

		setIsLoading(false);
	};

	return (
		<form onSubmit={handlePlacingOrder} className="flex flex-col w-full justify-start gap-4">
			{/* Delivery Options */}
			<h2 className="text-heading-3 mb-4">Delivery Options</h2>
			<div className="grid grid-cols-2 gap-4 mb-8">
				<button className="border-2 border-dark-900 text-dark-900 px-6 py-3 rounded-md">Ship</button>
				<button className="border-2 border-light-400 text-dark-700 px-6 py-3 rounded-md ">Pick Up</button>
			</div>

			{/* Address Form */}
			<EmailForm email={email} setEmail={setEmail} error={error} setError={setError} checkout={checkoutState.checkout} />
			<ShippingAddressElement />

			{/* Payment */}
			<h2 className="text-heading-3 my-8">Payment</h2>
			<PaymentElement />

			{/* Review Order */}
			<h2 className="text-heading-3 my-8">Review Order</h2>

			<button
				type="submit"
				className="mt-8 text-body-medium w-full flex items-center justify-center gap-2 py-3 rounded-full text-bold bg-dark-900 text-light-100 hover:bg-dark-700 transition-colors disabled:bg-light-400 disabled:text-dark-500"
				disabled={isLoading}
			>
				{
					isLoading ? (<div className="spinner" />) : "Place Order"
				}
			</button>
			{/* Show any error or success messages */}
			{message && <div className="mt-2 text-red-600">{message}</div>}
		</form>
	);
};

export default CheckoutForm;
