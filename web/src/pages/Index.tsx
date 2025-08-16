import CardForm from "../components/CardForm";
import CardList from "../components/CardList";
import Logo from "../components/Logo";
import Main from "../components/Main";

export default function Index() {
    return (
        <>
            <Logo />
            <Main>
                <CardForm />
                <CardList />
            </Main>
        </>
    )
}