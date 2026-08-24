import { useCallback, useState } from 'react'
import { CopyResults } from './components/CopyResults'
import { Header } from './components/Header'
import { HistoryDrawer } from './components/HistoryDrawer'
import { OfferForm } from './components/OfferForm'
import { Tabs } from './components/Tabs'
import { useCopyGenerator } from './hooks/useCopyGenerator'

export default function App() {
  const [historyOpen, setHistoryOpen] = useState(false)
  const closeHistory = useCallback(() => setHistoryOpen(false), [])
  const generator = useCopyGenerator()

  return (
    <div className="min-h-screen bg-[#080D16] text-slate-100">
      <Header
        status={generator.connectionStatus}
        historyCount={generator.history.length}
        onOpenHistory={() => setHistoryOpen(true)}
      />
      <Tabs />

      <main className="mx-auto w-full max-w-[1080px] px-4 py-7 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-[960px] space-y-10">
          <OfferForm
            isLoading={generator.isLoading}
            error={generator.error}
            onGenerate={generator.generate}
          />
          {generator.result && generator.lastRequest && (
            <CopyResults
              result={generator.result}
              request={generator.lastRequest}
              isLoading={generator.isLoading}
              error={generator.error}
              onRegenerate={generator.generate}
            />
          )}
        </div>
      </main>

      <footer className="mx-auto max-w-[1080px] px-4 pb-8 text-center text-[11px] text-slate-700 sm:px-6">
        CopyForge MVP · Conteúdo gerado por IA deve ser revisado antes da publicação.
      </footer>

      <HistoryDrawer
        open={historyOpen}
        history={generator.history}
        onClose={closeHistory}
        onSelect={generator.restore}
      />
    </div>
  )
}
