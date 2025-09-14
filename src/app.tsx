import AppRouter from "./components/router/AppRouter";

export default function App() {
  return (
    <div className="relative bg-[#232222] flex flex-col h-screen font-custom text-[var(--foreground)] overflow-hidden ">
      <AppRouter />
    </div>
  );
}
