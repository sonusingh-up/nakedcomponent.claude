import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'pankajkumarseo135@gmail.com',
    password: 'Try@9955',
  })

  if (authError) {
    console.error('Auth error:', authError)
    return
  }

  const userId = authData.user.id
  console.log('Logged in as:', userId)

  const { data: userHabits } = await supabase.from('user_habits').select('*').limit(1)
  const userHabitId = userHabits?.[0]?.id

  if (!userHabitId) {
    console.log('No user habits found')
    return
  }

  const { data, error } = await supabase
    .from('habit_logs')
    .upsert(
      {
        user_habit_id: userHabitId,
        log_date: '2026-06-28',
        count: 1,
      },
      { onConflict: 'user_habit_id,log_date' },
    )
    .select()
    .single()

  if (error) {
    console.error('Insert error:', JSON.stringify(error, null, 2))
  } else {
    console.log('Insert success:', data)
  }
}

test()
