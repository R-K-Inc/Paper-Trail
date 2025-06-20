import { useState, useEffect } from 'react'
import { PageHeader, PageHeaderHeading } from "@/components/page-header"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { notesApi } from "@/lib/api"
import { FileText, Plus, Clock, Tag, TrendingUp } from "lucide-react"
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
    const [recentNotes, setRecentNotes] = useState([])
    const [notes, setNotes] = useState([])
    const [notesCount, setNotesCount] = useState(0)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)

    // We only need isAuthenticated from the context now
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const response = await notesApi.getNotes()
                const notesData = response.data
                setNotes(notesData)
                setNotesCount(notesData.length)
                setRecentNotes(notesData.slice(0, 5))

                const uniqueCategories = [...new Set(notesData.map(note => note.category).filter(Boolean))]
                setCategories(uniqueCategories)
            } catch (error) {
                console.error('Error loading dashboard data:', error)
            }
        }
        // Only load data if the user is authenticated
        if (isAuthenticated) {
            loadDashboardData()
        }
    }, [isAuthenticated]) // Re-run when authentication state changes

    const filteredNotes = selectedCategory
        ? notes.filter(note => note.category === selectedCategory)
        : recentNotes

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Dashboard</PageHeaderHeading>
                <p className="text-muted-foreground">An overview of your notes and activity.</p>
            </PageHeader>

            <div className="space-y-6">
                {/* Stat Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="relative overflow-hidden border-l-4 border-l-primary">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Notes
                                </CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{notesCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {notesCount > 0 ? 'Keep up the great work!' : 'Start your journey'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-l-4 border-l-green-500">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Categories
                                </CardTitle>
                                <Tag className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{categories.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {categories.length > 0 ? 'Well organized!' : 'Add some categories'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    This Week
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {recentNotes.filter(note => {
                                    const noteDate = new Date(note.created_at)
                                    const weekAgo = new Date()
                                    weekAgo.setDate(weekAgo.getDate() - 7)
                                    return noteDate >= weekAgo
                                }).length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Notes created this week
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="col-span-full md:col-span-1">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Recent Notes
                                    </CardTitle>
                                    <CardDescription>
                                        Your latest thoughts and ideas
                                    </CardDescription>
                                </div>
                                <Button asChild size="sm" variant="outline">
                                    <Link to="/notes">
                                        View All
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {filteredNotes.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredNotes.slice(0, 5).map(note => (
                                        <div key={note.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{note.title}</p>
                                                <p className="text-xs text-muted-foreground truncate mt-1">
                                                    {note.content}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDate(note.created_at)}
                                                    </span>
                                                    {note.category && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs h-5 cursor-pointer"
                                                            onClick={() => setSelectedCategory(note.category)}
                                                        >
                                                            {note.category}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">No notes yet</p>
                                    <Button asChild size="sm" className="mt-3">
                                        <Link to="/notes">
                                            <Plus className="h-4 w-4 mr-1" />
                                            Create your first note
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="col-span-full md:col-span-1">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Get started with common tasks</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button asChild className="w-full justify-start" size="lg">
                                <Link to="/notes?new=true">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create New Note
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Welcome Card */}
                <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-primary">Welcome to Paper Trail</CardTitle>
                        <CardDescription>
                            Your personal space for capturing thoughts, ideas, and important information.
                            Keep everything organized and easily searchable in one place.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </>
    )
}
