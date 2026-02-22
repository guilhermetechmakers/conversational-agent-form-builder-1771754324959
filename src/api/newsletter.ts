import { api } from '@/lib/api'

export interface NewsletterSignupResponse {
  success: boolean
  message?: string
}

export async function subscribeNewsletter(email: string): Promise<NewsletterSignupResponse> {
  const result = await api.post<NewsletterSignupResponse>('/newsletter/subscribe', {
    email,
  })
  return result
}
