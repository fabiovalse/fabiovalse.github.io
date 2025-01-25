import Start from "./Start";
import Educations from "./sections/Education";
import Experiences from "./sections/Experiences";
import Technologies from "./sections/Technologies";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function App() {
  const sections = [
    { id: "exp", label: "Exp" },
    { id: "edu", label: "Edu" },
    { id: "tkit", label: "Tkit" }
  ];

  return (
    <div>
      <NavBar items={sections} />

      <Start />

      <Experiences id={sections[0].id} />

      <Educations id={sections[1].id} />

      <Technologies id={sections[2].id} />

      <Footer />
    </div>
  );
}
