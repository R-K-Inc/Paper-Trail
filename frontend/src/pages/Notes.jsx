import { useState, useEffect } from 'react'
import { PageHeader, PageHeaderHeading } from "@/components/page-header"
import { NoteForm } from "@/components/notes"
import { NotesList } from "@/components/notes-list"
import { notesApi } from "@/lib/api"

export default function Notes() {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadNotes()
    }, [])

    const loadNotes = async () => {
        try {
            setLoading(true)
            const response = await notesApi.getNotes()
            setNotes(response.data)
        } catch (err) {
            setError('Failed to load notes')
            console.error('Error loading notes:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateNote = async (noteData) => {
        const response = await notesApi.createNote(noteData)
        setNotes(prev => [response.data, ...prev])
    }

    const handleDeleteNote = async (noteId) => {
        await notesApi.deleteNote(noteId)
        setNotes(prev => prev.filter(note => note.id !== noteId))
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Notes</PageHeaderHeading>
            </PageHeader>
            
            <div className="space-y-6">
                <NoteForm onSubmit={handleCreateNote} />
                <NotesList notes={notes} onDelete={handleDeleteNote} />
            </div>
        </>
    )
}