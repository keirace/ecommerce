'use client';
import { JSX, Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Complete = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [dateAndTime, setDateAndTime] = useState<string | null>(null);
    const [amount, setAmount] = useState<string | null>(null);
    const [icon, setIcon] = useState<JSX.Element | null>(null);
    const [text, setText] = useState<string | null>(null);

    useEffect(() => {
        const SuccessIcon =
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M15.4695 0.232963C15.8241 0.561287 15.8454 1.1149 15.5171 1.46949L6.14206 11.5945C5.97228 11.7778 5.73221 11.8799 5.48237 11.8748C5.23253 11.8698 4.99677 11.7582 4.83452 11.5681L0.459523 6.44311C0.145767 6.07557 0.18937 5.52327 0.556912 5.20951C0.924454 4.89575 1.47676 4.93936 1.79051 5.3069L5.52658 9.68343L14.233 0.280522C14.5613 -0.0740672 15.1149 -0.0953599 15.4695 0.232963Z" fill="white" />
            </svg>;
        const ErrorIcon =
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M1.25628 1.25628C1.59799 0.914573 2.15201 0.914573 2.49372 1.25628L8 6.76256L13.5063 1.25628C13.848 0.914573 14.402 0.914573 14.7437 1.25628C15.0854 1.59799 15.0854 2.15201 14.7437 2.49372L9.23744 8L14.7437 13.5063C15.0854 13.848 15.0854 14.402 14.7437 14.7437C14.402 15.0854 13.848 15.0854 13.5063 14.7437L8 9.23744L2.49372 14.7437C2.15201 15.0854 1.59799 15.0854 1.25628 14.7437C0.914573 14.402 0.914573 13.848 1.25628 13.5063L6.76256 8L1.25628 2.49372C0.914573 2.15201 0.914573 1.59799 1.25628 1.25628Z" fill="white" />
            </svg>;

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');

        fetch(`/api/checkout?session_id=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status);
                setPaymentIntentId(data.payment_intent_id);
                setPaymentStatus(data.payment_status);
                setAmount((data.amount_total / 100).toFixed(2));
                const date = new Date(data.date_created * 1000);
                setDateAndTime(date.toLocaleString());

                if (data.status === 'complete') {
                    setIcon(SuccessIcon);
                    setText('Payment succeeded');
                } else {
                    setIcon(ErrorIcon);
                    setText('Something went wrong, please try again.');
                }
            }).catch((error) => {
                console.error('Error fetching checkout session:', error);
                setIcon(ErrorIcon);
                setText('Something went wrong, please try again.');
            });
    }, []);


    return (
        <Suspense>
            <div className='max-w-4xl min-h-screen py-16 px-6 mx-auto flex flex-col gap-8 items-center justify-center'>
                <div className={`aspect-square w-24 rounded-full flex justify-center items-center bg-black`}>
                    {icon}
                </div>

                <div className='w-full mx-auto flex flex-col items-center gap-2'>
                    <h2 className="text-heading-3">{text}</h2>
                    <p className="text-caption text-dark-500">Thank you for your purchase!</p>
                </div>

                <div className="border-2 border-light-300 rounded-lg p-6 w-full max-w-xl">
                    <table className="w-full">
                        <tbody className="w-full flex flex-col space-y-3">
                            <tr className="flex justify-between">
                                <td>Amount Paid</td>
                                <td className="text-body-medium">${amount}</td>
                            </tr>
                            <tr className="flex justify-between">
                                <td>Date and Time</td>
                                <td className="text-body-medium">{dateAndTime}</td>
                            </tr>
                            <tr className="flex justify-between">
                                <td>Transaction ID</td>
                                <td className="text-body-medium">{paymentIntentId}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Suspense>
    )
}

export default Complete