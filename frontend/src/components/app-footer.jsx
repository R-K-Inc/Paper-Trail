import { appConfig } from '@/config/app'

export function AppFooter() {
    return (
        <footer className="flex flex-col items-center justify-center gap-4 min-h-[3rem] md:h-20 py-6 border-t bg-muted/30">
            <p className="text-center text-sm leading-loose text-muted-foreground">
                Built by{' '}
                <a 
                    href={appConfig.author.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
                >
                    {appConfig.author.name}
                </a>
                . The source code is available on{' '}
                <a 
                    href={appConfig.github.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
                >
                    GitHub
                </a>
                .
            </p>
        </footer>
    )
}