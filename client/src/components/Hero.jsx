import heroImg from "../assets/hero.png";

// Displays the main branding area for Community Perk Pass.
// Shows the app title and hero image on the landing screen.
export default function Hero() {
  return (
    <div>
      <h1>Community Perk Pass</h1>
      <img src={heroImg} alt="Community Perk Pass" width="170" />
      <p>Support small businesses and discover local deals.</p>
    </div>
  );
}