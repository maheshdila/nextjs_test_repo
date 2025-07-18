'use client';
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterClientScript() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("jwt", token);
      router.replace("/");
    }
  }, [searchParams, router]);
  return null;
} 