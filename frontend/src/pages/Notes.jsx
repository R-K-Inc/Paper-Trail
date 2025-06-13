import { useState, useEffect } from 'react'
import { PageHeader, PageHeaderHeading } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { NoteForm } from "@/components/notes"
import { NotesList } from "@/components/notes-list"
import { notesApi } from "@/lib/api"
import { Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function Notes() {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)

    useEffect(() => {
        loadNotes()
    }, [])

    const loadNotes = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await notesApi.getNotes()
            setNotes(response.data)
        } catch (err) {
            setError('Failed to load notes')
            toast.error("Failed to load notes. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleCreateNote = async (noteData) => {
        try {
            const response = await notesApi.createNote(noteData)
            setNotes(prev => [response.data, ...prev])
            setShowCreateForm(false)
            toast.success("Note created successfully!")
        } catch (error) {
            toast.error("Failed to create note. Please try again.")
            throw error
        }
    }

    const handleUpdateNote = async (noteId, noteData) => {
        try {
            const response = await notesApi.updateNote(noteId, noteData)
            setNotes(prev => prev.map(note =>
                note.id === noteId ? response.data : note
            ))
            toast.success("Note updated successfully!")
        } catch (error) {
            toast.error("Failed to update note. Please try again.")
            throw error
        }
    }

    const handleDeleteNote = async (noteId) => {
        if (!confirm('Are you sure you want to delete this note?')) return

        try {
            await notesApi.deleteNote(noteId)
            setNotes(prev => prev.filter(note => note.id !== noteId))
            toast.success("Note deleted successfully!")
        } catch (error) {
            toast.error("Failed to delete note. Please try again.")
        }
    }

    // Extract unique categories
    const categories = [...new Set(notes.map(note => note.category).filter(Boolean))]

    // Filter notes by selected category
    const filteredNotes = selectedCategory
        ? notes.filter(note => note.category === selectedCategory)
        : notes

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <>
            <PageHeader>
                <div className="flex items-center justify-between">
                    <PageHeaderHeading>Notes ({filteredNotes.length})</PageHeaderHeading>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={loadNotes}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                            <Plus className="h-4 w-4 mr-2" />
                            {showCreateForm ? 'Cancel' : 'New Note'}
                        </Button>
                    </div>
                </div>
                {/* Category filter badges */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {categories.map(category => (
                            <Badge
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </Badge>
                        ))}
                        {selectedCategory && (
                            <Badge
                                variant="destructive"
                                className="cursor-pointer ml-2"
                                onClick={() => setSelectedCategory(null)}
                            >
                                Clear Filter
                            </Badge>
                        )}
                    </div>
                )}
            </PageHeader>

            <div className="space-y-6">
                {showCreateForm && (
                    <NoteForm
                        onSubmit={handleCreateNote}
                        onCancel={() => setShowCreateForm(false)}
                    />
                )}
                <NotesList
                    notes={filteredNotes}
                    onDelete={handleDeleteNote}
                    onUpdate={handleUpdateNote}
                />
            </div>
        </>
    )
}