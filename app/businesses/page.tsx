import { createClient } from '@/lib/supabase/server'
import { LiveBusinessExplorer } from '@/components/live-business-explorer'

export default async function BusinessesPage() {
  const supabase = await createClient()
  const [{ data: businesses }, { data: categories }] = await Promise.all([
    supabase.from('businesses').select('id, slug, name, description, address, city, rating, review_count, categories(name), services(price)').eq('status', 'approved').order('created_at', { ascending: false }),
    supabase.from('categories').select('name').order('name'),
  ])
  return <LiveBusinessExplorer businesses={(businesses ?? []) as never[]} categories={(categories ?? []).map((category) => category.name)} />
}
