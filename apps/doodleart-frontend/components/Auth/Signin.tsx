"use client";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { requiredBodySignin } from '@repo/fullstack-common/types';
import { HTTP_URL } from "@/middleware";


export function SignIn() {

    const [error, setError] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [form, setForm] = useState({
        "email": "",
        "password": ""
    });
    const router = useRouter();
    const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevents page reload

        const result = requiredBodySignin.safeParse(form);
        if (!result.success) {
            setError(result.error.issues[0]?.message);
            return;
        }

        try {
            const response = await axios.post(`${HTTP_URL}/api/v1/auth/signin`, form, { withCredentials: true });
            console.log(response.data);
            router.push('/dashboard');
        } catch (err) {
            const error = err as AxiosError;
            if (error.response && error.response.data) {
                const message = (error.response.data as { message: string }).message;
                setError(message);
            } else {
                setError("Something went wrong");
            }
        }
    };

    return (
        <div className="flex flex-col w-screen h-screen bg-[#0a0a19] items-center">

            {/* Site logo and Name */}
            <h1 className="text-4xl lg:text-5xl font-bold text-white flex flex-row gap-2 mt-8 lg:mt-10">
                <Image src="/weblogo.svg" alt='logo' width={45} height={45} draggable='false' />
                <div>
                    DoodleArt
                </div>
            </h1>

            {/* Sign In Form Body */}
            <div className="flex flex-col bg-[#211e34] items-center w-82 md:w-94 lg:w-md h-max p-6 rounded-3xl mt-15 gap-8 justify-center">

                {/* Sign In Title */}
                <h1 className="text-3xl md:text-4xl font-bold">
                    Sign In
                </h1>

                {/* Main Form Body */}
                <div className="flex flex-col items-center gap-5 w-full">

                    {/* Google, Github and facebook buttons */}
                    <div className="flex flex-row gap-5">
                        <a href={`${HTTP_URL}/api/v1/auth/google`}>
                            <button className="w-22 md:w-25 lg:w-30 h-13 border border-gray-400 rounded-lg hover:border-[#d08fff] flex items-center justify-center">
                                <Image src="/google.svg" alt="google" width={30} height={30} className="object-contain" draggable="false" />
                            </button>
                        </a>

                        <a href={`${HTTP_URL}/api/v1/auth/github`}>
                            <button className="w-22 md:w-25 lg:w-30 h-13 border border-gray-400 rounded-lg hover:border-[#d08fff] flex items-center justify-center">
                                <Image src="/github2.svg" alt="github" width={30} height={30} className="object-contain" draggable="false" />
                            </button>
                        </a>

                        <a href={`${HTTP_URL}/api/v1/auth/facebook`}>
                            <button className="w-22 md:w-25 lg:w-30 h-13 border border-gray-400 rounded-lg hover:border-[#d08fff] flex items-center justify-center">
                                <Image src="/facebook.svg" alt="facebook" width={30} height={30} className="object-contain" draggable="false" />
                            </button>
                        </a>
                    </div>

                    {/* __or__ */}
                    <div className="flex items-center gap-4 text-gray-400 my-2">
                        <div className="flex-grow h-px bg-gray-600"></div>
                        <span className="text-sm">
                            ─────   or   ─────
                        </span>
                        <div className="flex-grow h-px bg-gray-600"></div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="w-full text-sm text-red-400 bg-red-900/20 border border-red-500 rounded-lg px-4 py-2">
                            {error}
                        </div>
                    )}

                    {/* Main Form */}
                    <form className="flex flex-col items-center gap-5 w-full" onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>

                        {/* Input tags */}
                        <div className="flex flex-col gap-2 w-full items-center">
                            {/* Email Field */}
                            <div className="relative w-full">
                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Image src='/email.svg' alt='email' width={23} height={23} draggable='false' />
                                </span>
                                <input
                                    className="w-full p-3 pl-10 pr-10 bg-[#0a0a19] rounded-lg text-white"
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete='email'
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="relative w-full">
                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Image src='/password.svg' alt='password' width={25} height={25} draggable='false' />
                                </span>
                                <input
                                    className="w-full p-3 pl-10 pr-10 bg-[#0a0a19] rounded-lg text-white"
                                    name="password"
                                    placeholder="Password"
                                    type={passwordVisible ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                />
                                <span
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                >
                                    <Image src={passwordVisible ? '/closeeye.svg' : '/openeye.svg'} alt='eyes' width={23} height={23} draggable='false' />
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-[#5f00a3] p-3 rounded-lg w-full font-bold text-lg hover:bg-[#5f00a375] active:bg-[#5f00a3b2]"
                        >
                            Submit
                        </button>

                        {/* Navigate link */}
                        <p className="font-semibold">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-gray-400 underline">
                                Click Here
                            </Link>
                        </p>
                    </form>

                </div>
            </div>
        </div >
    );
}