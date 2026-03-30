const DAILY_LIMIT = 3

interface RateLimitData { count: number; date: string }

export function checkRateLimit(cookieValue: string | undefined): boolean {
  if (!cookieValue) return true
  try {
    const data: RateLimitData = JSON.parse(cookieValue)
    if (data.date !== new Date().toDateString()) return true  // new day, reset
    return data.count < DAILY_LIMIT
  } catch {
    return true
  }
}

export function incrementRateLimit(cookieValue: string | undefined): string {
  try {
    const data: RateLimitData = cookieValue ? JSON.parse(cookieValue) : { count: 0, date: '' }
    const today = new Date().toDateString()
    const count = data.date === today ? data.count + 1 : 1
    return JSON.stringify({ count, date: today })
  } catch {
    return JSON.stringify({ count: 1, date: new Date().toDateString() })
  }
}
