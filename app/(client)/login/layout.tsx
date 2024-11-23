"use client"

import UnAuthGuard from "@client/components/guard/UnAuthGuard";

export default function LoginLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {
    return (
        <UnAuthGuard>
            {children}
        </UnAuthGuard>
    )
}