import { Outlet, ScrollRestoration } from 'react-router-dom';
import Start from "./Start";
import Educations from "./sections/Education";
import Experiences from "./sections/Experiences";
import Technologies from "./sections/Technologies";
import Gists from "./sections/Gists";
import NavBar from "./NavBar";
import Footer from "./Footer";

const sections = [
  { id: "exp", label: "Exp" },
  { id: "edu", label: "Edu" },
  { id: "tkit", label: "Tkit" },
  { id: "gists", label: "Gists" }
];

export function Home() {
  return (
    <div>
      <NavBar items={sections} />
      <Start />
      <Experiences id={sections[0].id} />
      <Educations id={sections[1].id} />
      <Technologies id={sections[2].id} />
      <Gists id={sections[3].id} />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}
