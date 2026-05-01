import Link from 'next/link'
import { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
}

export default function Layout({ title, children }: Props) {
  return (
    <main>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{title}</h1>
        <nav style={{ display: 'flex', gap: '0.8rem', fontSize: '0.95rem' }}>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/chat">Chat</Link>
        </nav>
      </header>
      {children}
      <footer className="text-sm text-center p-4">
        <a href="/terms">Terms</a> • <a href="/privacy">Privacy</a> •{' '}
        <a href="/community-guidelines">Guidelines</a>
      </footer>
    </main>
  )
}
