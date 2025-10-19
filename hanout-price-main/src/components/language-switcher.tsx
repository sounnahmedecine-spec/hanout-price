
'use client';

import { Globe } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const FranceFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 3 2">
        <rect width="3" height="2" fill="#fff"/>
        <rect width="2" height="2" fill="#002395"/>
        <rect width="1" height="2" fill="#ed2939"/>
    </svg>
);

const MoroccoFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 900 600">
        <rect width="900" height="600" fill="#c1272d"/>
        <path d="M450 155.2l-65.7 200h211.4l-174-123.6 105.7 184.2z" fill="none" stroke="#006233" stroke-width="30"/>
    </svg>
);

const DarijaFlag = () => (
     <div style={{ position: 'relative', width: 24, height: 24 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}>
            <FranceFlag />
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}>
            <MoroccoFlag />
        </div>
    </div>
)


export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'fr', name: 'Français', Flag: FranceFlag },
    { code: 'ar', name: 'العربية', Flag: MoroccoFlag },
    { code: 'dr', name: 'الدارجة', Flag: DarijaFlag },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Changer de langue</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(({ code, name, Flag }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            className="flex items-center gap-2"
          >
            <Flag />
            <span>{name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
