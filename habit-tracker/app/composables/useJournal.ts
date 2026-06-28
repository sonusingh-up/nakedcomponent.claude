import type { EntryType, JournalEntry, Mood } from '~/types'

/** CRUD for journal entries + audio upload to Supabase Storage. */
export function useJournal() {
  const supabase = useSupabaseClient<any>()
  const user = useSupabaseUser()

  async function list(): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*, user_habit:user_habits(custom_name, habit:habits(name))')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as unknown as JournalEntry[]
  }

  async function create(payload: {
    entry_type: EntryType
    title?: string | null
    body?: string | null
    audio_url?: string | null
    audio_duration?: number | null
    image_url?: string | null
    user_habit_id?: string | null
    mood?: Mood | null
  }): Promise<JournalEntry> {
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id
    if (!userId) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({ ...payload, user_id: userId })
      .select()
      .single()
    if (error) throw error
    return data as unknown as JournalEntry
  }

  async function remove(id: string): Promise<void> {
    const { error } = await supabase.from('journal_entries').delete().eq('id', id)
    if (error) throw error
  }

  async function update(id: string, updates: { title?: string | null; body?: string | null }): Promise<void> {
    const { error } = await supabase.from('journal_entries').update(updates).eq('id', id)
    if (error) throw error
  }

  /** Upload a recorded audio blob; returns its public URL. */
  async function uploadAudio(blob: Blob): Promise<string> {
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id
    if (!userId) throw new Error('Not authenticated')
    const ext = blob.type.includes('mp4') ? 'mp4' : 'webm'
    const path = `${userId}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage
      .from('journal-audio')
      .upload(path, blob, { contentType: blob.type || 'audio/webm' })
    if (error) throw error
    const { data } = supabase.storage.from('journal-audio').getPublicUrl(path)
    return data.publicUrl
  }

  /** Upload an image file; returns its public URL. */
  async function uploadImage(file: File): Promise<string> {
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id
    if (!userId) throw new Error('Not authenticated')
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${userId}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage
      .from('journal_images')
      .upload(path, file, { contentType: file.type })
    if (error) throw error
    const { data } = supabase.storage.from('journal_images').getPublicUrl(path)
    return data.publicUrl
  }

  return { list, create, remove, uploadAudio, uploadImage }
}
