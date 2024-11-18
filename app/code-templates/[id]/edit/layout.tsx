"use client"

import AuthGuard from "@client/components/guard/AuthGuard";

export default function EditCodeTemplateLayout(
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