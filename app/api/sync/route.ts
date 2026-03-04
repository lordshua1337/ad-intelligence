import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/server'
import { adminClient } from '@/lib/supabase/client'
import { z } from 'zod'

const syncPushSchema = z.object({
  competitors: z.array(z.object({
    name: z.string().min(1),
    domain: z.string().optional(),
    notes: z.string().optional(),
    sources: z.array(z.record(z.string(), z.unknown())).optional(),
  })).optional(),
  briefs: z.array(z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    competitor_name: z.string().optional(),
  })).optional(),
})

export async function GET() {
  const user = await requireUser()

  const [competitorsRes, briefsRes, alertsRes] = await Promise.all([
    adminClient.from('competitors').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    adminClient.from('briefs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    adminClient.from('alerts').select('*').eq('user_id', user.id),
  ])

  return NextResponse.json({
    competitors: competitorsRes.data ?? [],
    briefs: briefsRes.data ?? [],
    alerts: alertsRes.data ?? [],
  })
}

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()
  const parsed = syncPushSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid sync data', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const results: Record<string, number> = {}

  if (parsed.data.competitors?.length) {
    const rows = parsed.data.competitors.map((c) => ({
      user_id: user.id,
      name: c.name,
      domain: c.domain ?? null,
      notes: c.notes ?? null,
      sources: c.sources ?? [],
    }))

    await adminClient.from('competitors').insert(rows)
    results.competitors = rows.length
  }

  if (parsed.data.briefs?.length) {
    const rows = parsed.data.briefs.map((b) => ({
      user_id: user.id,
      title: b.title,
      content: b.content,
    }))

    await adminClient.from('briefs').insert(rows)
    results.briefs = rows.length
  }

  return NextResponse.json({ synced: results })
}
