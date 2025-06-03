import { useState, useEffect } from 'react'
import { PageHeader, PageHeaderHeading } from "@/components/page-header"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { notesApi } from "@/lib/api"
import { FileText, Plus } from "lucide-react"

export default function Dashboard() {
    const [recentNotes, setRecentNotes] = useState([])
    const [notesCount, setNotesCount] = useState(0)

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const response = await notesApi.getNotes()
                const notes = response.data
                setNotesCount(notes.length)
                setRecentNotes(notes.slice(0, 3)) // Show 3 most recent
            } catch (error) {
                console.error('Error loading dashboard data:', error)
            }
        }
        loadDashboardData()
    }, [])

    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Dashboard</PageHeaderHeading>
            </PageHeader>
            
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Notes Overview
                                </CardTitle>
                                <CardDescription>
                                    You have {notesCount} notes total
                                </CardDescription>
                            </div>
                            <Button asChild size="sm">
                                <Link to="/notes">
                                    <Plus className="h-4 w-4 mr-1" />
                                    New Note
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    {recentNotes.length > 0 && (
                        <CardContent>
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium">Recent Notes:</h4>
                                {recentNotes.map(note => (
                                    <div key={note.id} className="text-sm text-muted-foreground">
                                        • {note.title}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Paper Trail</CardTitle>
                        <CardDescription>Your personal note-taking app</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Keep track of your thoughts, ideas, and important information all in one place.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
