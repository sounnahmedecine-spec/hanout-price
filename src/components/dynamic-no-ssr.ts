import dynamic from 'next/dynamic';

export const noSsr = <T>(component: () => Promise<{ default: React.ComponentType<T> }>) => dynamic(component, { ssr: false });