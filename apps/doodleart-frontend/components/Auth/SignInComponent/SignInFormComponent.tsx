"use client";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { requiredBodySignin } from "@repo/fullstack-common/types";
import Image from "next/image";
import { HTTP_URL } from "@/proxy";

export default function SignInFormComponent() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  interface ApiErrorResponse {
    message: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const result = requiredBodySignin.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      setLoading(false); // ✅ reset if validation fails
      return;
    }

    try {
      await axios.post(`${HTTP_URL}/api/v1/auth/signin`, form, {
        withCredentials: true,
      });
      router.push("/dashboard");
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      if (error.response && error.response.data) {
        const message = (error.response.data as ApiErrorResponse).message;
        setError(message);
      } else {
        setError("Something went wrong");
      }
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="w-full text-sm text-red-400 bg-red-900/20 border border-red-500 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      <form
        className="flex flex-col items-center gap-5 w-full"
        onSubmit={handleSubmit}
      >
        {/* Input tags */}
        <div className="flex flex-col gap-2 w-full items-center">
          {/* Email Field */}
          <div className="relative w-full">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Image
                src="/email.svg"
                alt="email"
                width={23}
                height={23}
                draggable="false"
              />
            </span>
            <input
              className="w-full p-3 pl-10 pr-10 bg-[#0a0a19] rounded-lg text-white"
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative w-full">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Image
                src="/password.svg"
                alt="password"
                width={25}
                height={25}
                draggable="false"
              />
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
              <Image
                src={passwordVisible ? "/closeeye.svg" : "/openeye.svg"}
                alt="eyes"
                width={23}
                height={23}
                draggable="false"
              />
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading} // ✅ prevents multiple clicks
          className={`p-3 rounded-lg w-full font-bold text-lg text-white ${loading ? "bg-[#5f00a375] cursor-not-allowed" : "bg-[#5f00a3] hover:bg-[#5f00a375] active:bg-[#5f00a3b2]"}`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        <p className="font-semibold text-white">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-gray-400 underline">
            Click Here
          </Link>
        </p>
      </form>
    </>
  );
}
