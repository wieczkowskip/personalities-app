import "./App.css";
import TheFilters from "./components/Layout/TheFilters";
import TheFooter from "./components/Layout/TheFooter";
import TheHeader from "./components/Layout/TheHeader";
import TheIntroduction from "./components/Layout/TheIntroduction";
import TheSummary from "./components/Layout/TheSummary";
import TheSignInModal from "./components/Modals/TheSignInModal";

function App() {
  return (
    <>
      <div className="App">
        <TheHeader />
        <TheIntroduction />
        <TheSummary />
        <TheFilters />
        <TheFooter />
      </div>
    </>
  );
}

export default App;
