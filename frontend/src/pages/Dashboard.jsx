import { useState, useEffect } from 'react'
import { PageHeader, PageHeaderHeading } from "@/components/page-header"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { notesApi } from "@/lib/api"
import { FileText, Plus, Clock, Tag, TrendingUp } from "lucide-react"

export default function Dashboard() {
    const [recentNotes, setRecentNotes] = useState([])
    const [notesCount, setNotesCount] = useState(0)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const response = await notesApi.getNotes()
                const notes = response.data
                setNotesCount(notes.length)
                setRecentNotes(notes.slice(0, 5)) // Show 5 most recent
                
                // Get unique categories
                const uniqueCategories = [...new Set(notes.map(note => note.category).filter(Boolean))]
                setCategories(uniqueCategories)
            } catch (error) {
                console.error('Error loading dashboard data:', error)
            }
        }
        loadDashboardData()
    }, [])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now - date)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) return 'Today'
        if (diffDays === 2) return 'Yesterday'
        if (diffDays <= 7) return `${diffDays - 1} days ago`
        return date.toLocaleDateString()
    }

    return (
        <>
            <PageHeader>
                <PageHeaderHeading className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Dashboard
                </PageHeaderHeading>
            </PageHeader>
            
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
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
                            {recentNotes.length > 0 ? (
                                <div className="space-y-3">
                                    {recentNotes.map(note => (
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
                                                        <Badge variant="secondary" className="text-xs h-5">
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
                                <Link to="/notes">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create New Note
                                </Link>
                            </Button>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <Button asChild variant="outline" size="sm">
                                    <Link to="/pages/sample">
                                        View Sample
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="sm">
                                    <Link to="/notes">
                                        Browse Notes
                                    </Link>
                                </Button>
                            </div>

                            {categories.length > 0 && (
                                <div className="pt-4 border-t">
                                    <p className="text-sm font-medium mb-2">Your Categories</p>
                                    <div className="flex flex-wrap gap-1">
                                        {categories.slice(0, 6).map(category => (
                                            <Badge key={category} variant="outline" className="text-xs">
                                                {category}
                                            </Badge>
                                        ))}
                                        {categories.length > 6 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{categories.length - 6} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}
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
