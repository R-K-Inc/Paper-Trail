import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, X, Plus } from "lucide-react"

export function NoteForm({ onSubmit, initialNote = null, onCancel }) {
  const [title, setTitle] = useState(initialNote?.title || '')
  const [content, setContent] = useState(initialNote?.content || '')
  const [category, setCategory] = useState(initialNote?.category || '')
  const [tags, setTags] = useState(initialNote?.tags || [])
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = ['Personal', 'Work', 'Ideas', 'Research', 'Todo']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    try {
      setLoading(true)
      setError('')
      await onSubmit({ 
        title: title.trim(), 
        content: content.trim(),
        category,
        tags
      })
      if (!initialNote) {
        setTitle('')
        setContent('')
        setCategory('')
        setTags([])
      }
    } catch (error) {
      setError('Failed to save note. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {initialNote ? 'Edit Note' : 'Create New Note'}
        </h3>
        {initialNote && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" size="sm" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
              {tag} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Note content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-32 resize-none"
          required
        />
      </div>

      <Button type="submit" disabled={loading || !title.trim() || !content.trim()}>
        <Save className="h-4 w-4 mr-2" />
        {loading ? 'Saving...' : (initialNote ? 'Update Note' : 'Create Note')}
      </Button>
    </form>
  )
}