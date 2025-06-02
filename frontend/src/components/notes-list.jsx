import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function NotesList({ notes, onDelete }) {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notes yet. Create your first note above!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id} className="relative">
          <CardHeader>
            <CardTitle className="text-lg">{note.title}</CardTitle>
            <CardDescription>
              Created: {new Date(note.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{note.content}</p>
            {onDelete && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(note.id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}