import About from "@/features/about/_components/About";
import Experience from "@/features/experience/_components/Experience";
import Footer from "@/features/footer/_components/Footer";
import Hero from "@/features/hero/_components/Hero";
import Navbar from "@/features/navbar/_components/Navbar";
import Photography from "@/features/photography/_components/Photography";
import Projects from "@/features/projects/_components/Projects";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="flex flex-col w-container mx-auto my-8">
      <Navbar />
      <Hero />
      <Experience />
      <Projects />
      <About />
      <Photography />
      <Footer />
    </div>
  );
}
