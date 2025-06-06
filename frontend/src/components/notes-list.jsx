import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Download, Filter } from "lucide-react"
import { NoteForm } from "./notes"

export function NotesList({ notes, onDelete, onUpdate }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editingNote, setEditingNote] = useState(null)
  const [sortBy, setSortBy] = useState('created_at')

  const categories = ['all', ...new Set(notes.map(note => note.category).filter(Boolean))]

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'updated_at') return new Date(b.updated_at) - new Date(a.updated_at)
      return new Date(b.created_at) - new Date(a.created_at)
    })

  const exportNotes = () => {
    const dataStr = JSON.stringify(filteredNotes, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'notes-export.json'
    link.click()
  }

  if (editingNote) {
    return (
      <NoteForm
        initialNote={editingNote}
        onSubmit={async (noteData) => {
          await onUpdate(editingNote.id, noteData)
          setEditingNote(null)
        }}
        onCancel={() => setEditingNote(null)}
      />
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notes yet. Create your first note above!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Date Created</SelectItem>
            <SelectItem value="updated_at">Date Modified</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportNotes} size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Notes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="relative hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                  <CardDescription>
                    Created: {new Date(note.created_at).toLocaleDateString()}
                    {note.updated_at && note.updated_at !== note.created_at && (
                      <span className="block">
                        Updated: {new Date(note.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingNote(note)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {note.content}
              </p>
              <div className="space-y-2">
                {note.category && (
                  <Badge variant="outline">{note.category}</Badge>
                )}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No notes match your search criteria.
        </div>
      )}
    </div>
  )
}