'use client';

import Link from 'next/link';
import { Camera, Barcode, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function ActionCard({ href, icon: Icon, title, description }: { href: string; icon: React.ElementType; title: string; description: string }) {
    return (
        <Link href={href} className="block hover:bg-muted/50 transition-colors rounded-lg">
            <Card className="h-full text-center bg-transparent border-0 shadow-none">
                <CardHeader className="p-4">
                    <Icon className="mx-auto h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground">{description}</p>
                </CardContent>
            </Card>
        </Link>
    );
}

export default function ActionGrid() {
    return (
        <Card>
            <div className="grid grid-cols-3 divide-x">
                <ActionCard href="/add-price?method=photo" icon={Camera} title="Photo" description="Via l'IA" />
                <ActionCard href="/add-price?method=barcode" icon={Barcode} title="Code-barres" description="Scanner" />
                <ActionCard href="/add-price?method=manual" icon={PlusCircle} title="Manuel" description="Remplir" />
            </div>
        </Card>
    );
}