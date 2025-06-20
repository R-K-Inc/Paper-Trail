import { appConfig, baseUrl } from "@/config/app"

export function AppLogo() {
    return (
        <div className='flex items-center gap-2 h-14'>
            <img
                src={baseUrl + '/logo.PNG'}
                alt={appConfig.name}
                className='h-full w-auto object-contain'
            />
            <span className="font-semibold text-nowrap">{appConfig.name}</span>
        </div>
    )
}