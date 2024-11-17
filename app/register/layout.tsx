"use client"

import UnAuthGuard from "@client/components/guard/UnAuthGuard";

export default function RegisterLayout(
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