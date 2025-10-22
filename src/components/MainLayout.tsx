'use client';

import { useModal } from '@/context/ModalContext';
import AddPriceModal from '@/components/AddPriceModal';
import Header from '@/components/Header';
import BottomNav from '@/app/bottom-nav';
import AuthGate from '@/components/AuthGate';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isModalOpen, closeModal } = useModal();

  return (
    <>
      <Header />
      <main className="flex-grow pt-20 pb-20">
        <AuthGate>
          {children}
        </AuthGate>
      </main>
      <BottomNav />
      <AddPriceModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}