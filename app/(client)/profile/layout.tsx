"use client"

import AuthGuard from "@client/components/guard/AuthGuard";

export default function ProfileLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {
    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    )
}