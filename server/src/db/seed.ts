import { client, db } from '.'
import { goalCompletions, goals } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'Acordar Cedo', desiredWeeklyFrequency: 7 },
      { title: 'Beber 2L Água', desiredWeeklyFrequency: 7 },
      { title: 'Academia', desiredWeeklyFrequency: 3 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
    { goalId: result[2].id, createdAt: startOfWeek.add(2, 'day').toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
