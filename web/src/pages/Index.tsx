import { useState } from "react";
import CardForm from "../components/CardForm";
import CardList from "../components/CardList";
import Logo from "../components/Logo";
import Main from "../components/Main";

export default function Index() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleLinkCreated = () => {
        // Forçar atualização da lista de links
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <>
            <Logo />
            <Main>
                <CardForm onLinkCreated={handleLinkCreated} />
                <CardList key={refreshTrigger} />
            </Main>
        </>
    )
}