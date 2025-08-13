import Content from './components/Content'
import Logo from './components/Logo'
import Index from './pages/Index'
//import Redirect from './pages/Redirect'
//import NotFound from './pages/NotFound'

function App() {
    return (
        <>
            <Content>
                <Logo />
                <Index />
                {/* <Redirect /> */}
                {/* <NotFound /> */}
            </Content>
        </>
    )
}

export default App
