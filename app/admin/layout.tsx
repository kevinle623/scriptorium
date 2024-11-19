"use client"

import RoleGuard from "@client/components/guard/RoleGuard";

export default function AdminLayout(
    {
      children,
    }: {
      children: React.ReactNode
    }) {
  return (
      <RoleGuard>
        {children}
      </RoleGuard>
  )
}