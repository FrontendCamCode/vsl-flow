import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function createScript(data: Database['public']['Tables']['scripts']['Insert']) {
  const { data: script, error } = await supabase
    .from('scripts')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return script
}

export async function getScripts() {
  const { data, error } = await supabase
    .from('scripts')
    .select('*, script_blocks(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getScript(id: string) {
  const { data, error } = await supabase
    .from('scripts')
    .select('*, script_blocks(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function updateScript(id: string, data: Database['public']['Tables']['scripts']['Update']) {
  const { data: script, error } = await supabase
    .from('scripts')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return script
}

export async function deleteScript(id: string) {
  const { error } = await supabase
    .from('scripts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function createScriptBlock(scriptId: string, content: string) {
  const { data, error } = await supabase
    .from('script_blocks')
    .insert({
      script_id: scriptId,
      content,
      order_index: 0 // Will be updated after insert
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateScriptBlock(id: string, content: string) {
  const { data, error } = await supabase
    .from('script_blocks')
    .update({ content })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteScriptBlock(id: string) {
  const { error } = await supabase
    .from('script_blocks')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getScriptVersions(scriptId: string) {
  const { data, error } = await supabase
    .from('script_versions')
    .select('*')
    .eq('script_id', scriptId)
    .order('version_number', { ascending: false })

  if (error) throw error
  return data
}

export async function createScriptVersion(scriptId: string) {
  // Get the current version number
  const { data: currentVersion, error: versionError } = await supabase
    .from('script_versions')
    .select('version_number')
    .eq('script_id', scriptId)
    .order('version_number', { ascending: false })
    .limit(1)
    .single()

  if (versionError && versionError.code !== 'PGRST116') throw versionError

  const newVersionNumber = (currentVersion?.version_number || 0) + 1

  // Create the new version
  const { data: version, error: createError } = await supabase
    .from('script_versions')
    .insert({
      script_id: scriptId,
      version_number: newVersionNumber
    })
    .select()
    .single()

  if (createError) throw createError

  // Get all current blocks
  const { data: blocks, error: blocksError } = await supabase
    .from('script_blocks')
    .select('*')
    .eq('script_id', scriptId)

  if (blocksError) throw blocksError

  // Create version blocks
  if (blocks) {
    const versionBlocks = blocks.map((block, index) => ({
      version_id: version.id,
      content: block.content,
      order_index: index
    }))

    const { error: blocksCreateError } = await supabase
      .from('version_blocks')
      .insert(versionBlocks)

    if (blocksCreateError) throw blocksCreateError
  }

  // Update script's current version
  const { error: updateError } = await supabase
    .from('scripts')
    .update({ current_version: newVersionNumber })
    .eq('id', scriptId)

  if (updateError) throw updateError

  return version
} 