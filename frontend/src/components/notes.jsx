import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function NoteForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    try {
      setLoading(true)
      setError('')
      await onSubmit({ title: title.trim(), content: content.trim() })
      setTitle('')
      setContent('')
    } catch (error) {
      setError('Failed to create note. Please try again.')
      console.error('Failed to create note:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Create New Note</h3>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Input
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Note content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-32 p-3 border rounded-md resize-none"
        required
      />
      <Button type="submit" disabled={loading || !title.trim() || !content.trim()}>
        {loading ? 'Creating...' : 'Create Note'}
      </Button>
    </form>
  )
}