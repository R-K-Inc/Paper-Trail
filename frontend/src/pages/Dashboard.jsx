import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Dashboard</PageHeaderHeading>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Paper Trail</CardTitle>
                    <CardDescription>Paper Trail</CardDescription>
                </CardHeader>
            </Card>
        </>
    )
}
