import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'primereact/button';

interface HeaderProps {
  title: string;
  subtitle: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export default function Header({ title, subtitle, showAddButton = false, onAddClick }: HeaderProps) {
  return (
    <div className="bg-white shadow-lg border-b-4" style={{borderBottomColor: 'var(--brand-color)'}}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="p-2 rounded-lg shadow-md" style={{backgroundColor: 'var(--brand-color)'}}>
                <Image
                  src="/logo.png"
                  alt="ZeitWorks"
                  width={80}
                  height={80}
                  className="rounded-md"
                  priority
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{color: 'var(--brand-color)'}}>{title}</h1>
              <p className="text-gray-600 mt-1">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/api-doc">
              <Button
                label="API Docs"
                icon="pi pi-book"
                outlined
                style={{borderColor: 'var(--brand-color)', color: 'var(--brand-color)'}}
                className="hover:bg-gray-50 transition-colors"
              />
            </Link>
            {showAddButton && onAddClick && (
              <Button
                label="Add New User"
                icon="pi pi-plus"
                onClick={onAddClick}
                style={{backgroundColor: 'var(--brand-color)', borderColor: 'var(--brand-color)'}}
                className="hover:opacity-90 transition-opacity"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
