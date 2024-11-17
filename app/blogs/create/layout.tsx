"use client"

import AuthGuard from "@client/components/guard/AuthGuard";

export default function BlogPostCreateLayout(
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