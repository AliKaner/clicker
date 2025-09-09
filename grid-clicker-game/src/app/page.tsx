import ClientOnly from '@/components/ClientOnly/ClientOnly';
import GameWrapper from '@/components/GameWrapper/GameWrapper';

export default function Home() {
  return (
    <ClientOnly
      fallback={
        <div className="game-container">
          <header style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Grid Clicker Game</h1>
            <p style={{ opacity: 0.7 }}>Loading...</p>
          </header>
          <main style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px'
          }}>
            <div style={{ opacity: 0.5 }}>Loading game...</div>
          </main>
        </div>
      }
    >
      <GameWrapper />
    </ClientOnly>
  );
}
