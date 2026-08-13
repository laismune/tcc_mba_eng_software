import { useEffect, useRef, useState } from "react";
import "./ForestFlow.css";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Products } from "./components/Products";
import { Footer } from "./components/Footer";
import { ProductPage } from "./components/ProductPage";

const PRODUCT_TITLES = {
  getstats: "GetStats",
  quickvol: "QuickVol",
};

export default function ForestFlow() {
  const [navOpen, setNavOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [page, setPage] = useState("home"); // "home" | "getstats" | "quickvol"
  const topRef = useRef(null);
  const sobreRef = useRef(null);
  const produtosRef = useRef(null);

  useEffect(() => {
    if (page !== "home") return;
    const onScroll = () => {
      const sections = [
        { id: "top", ref: topRef },
        { id: "sobre", ref: sobreRef },
        { id: "produtos", ref: produtosRef },
      ];
      let current = "top";
      sections.forEach((s) => {
        if (s.ref.current && window.scrollY >= s.ref.current.offsetTop - 120) {
          current = s.id;
        }
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  const goToProduct = (key) => {
    setPage(key);
    window.scrollTo({ top: 0 });
  };

  const goHome = () => {
    setPage("home");
    window.scrollTo({ top: 0 });
  };

  if (page !== "home") {
    return <ProductPage title={PRODUCT_TITLES[page]} onBack={goHome} onNavigate={goToProduct} />;
  }

  return (
    <div className="ff">
      <Nav
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        active={active}
        scrollTo={scrollTo}
        topRef={topRef}
        sobreRef={sobreRef}
        produtosRef={produtosRef}
        onNavigate={goToProduct}
      />
      <Hero topRef={topRef} scrollTo={scrollTo} produtosRef={produtosRef} />
      <Products produtosRef={produtosRef} onNavigate={goToProduct} />
      <Footer />
    </div>
  );
}
