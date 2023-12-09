import { ensureExists } from "karakuri";

function App(): JSX.Element {
    console.log(ensureExists(5));

    return (
        <main>
        </main>
    );
}

export default App;
