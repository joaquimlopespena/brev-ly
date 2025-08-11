import Main from './components/Main'
import Content from './components/Content'
import Logo from './components/Logo'
import CardForm from './pages/CardForm'
import CardList from './pages/CardList'

function App() {
    return (
        <>
            <Content>
                <Logo />
                <Main>
                    <CardForm />
                    <CardList />
                </Main>
            </Content>
        </>
    )
}

export default App
