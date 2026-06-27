import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import type { Lead, EnquiryTypeValue, LeadStatusValue } from "@/types/database";

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

export async function GET(request: NextRequest) {
  // Authorize: staff only (defense in depth alongside the proxy).
  const { profile } = await getCurrentUser();
  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const sp = request.nextUrl.searchParams;
  const status = sp.get("status");
  const enquiry = sp.get("enquiry");

  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status as LeadStatusValue);
  if (enquiry) query = query.eq("enquiry_type", enquiry as EnquiryTypeValue);
  const { data } = await query;
  const leads = (data as Lead[]) ?? [];

  const headers = [
    "Name",
    "Mobile",
    "Email",
    "City",
    "Enquiry Type",
    "Interest",
    "Status",
    "Source",
    "Message",
    "Date",
  ];
  const rows = leads.map((l) =>
    [
      l.name,
      l.mobile,
      l.email,
      l.city,
      l.enquiry_type,
      l.interest_type,
      l.status,
      l.lead_source,
      l.message,
      l.created_at,
    ]
      .map(csvCell)
      .join(",")
  );
  const csv = [headers.map(csvCell).join(","), ...rows].join("\r\n");

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="akr-nexus-leads-${date}.csv"`,
    },
  });
}
