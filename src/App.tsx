import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages/Home'
import Docs from './pages/Docs'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
