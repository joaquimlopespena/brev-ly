import { Route, Routes } from 'react-router-dom'
import Content from './components/Content'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Redirect from './pages/Redirect'

function App() {
    return (
        <Content>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/:shortUrl" element={<Redirect />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/not-found" element={<NotFound />} />
            </Routes>
        </Content>
    )
}

export default App
