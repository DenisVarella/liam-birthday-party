import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { PhotoGallery } from "@/components/photo-gallery";
import { EventDetails } from "@/components/event-details";
import { SpaceLayout } from "@/components/space-layout";
import { MenuSection } from "@/components/menu-section";
import { EntertainmentSection } from "@/components/entertainment-section";
import { ShareSection } from "@/components/share-section";
import { Footer } from "@/components/footer";
import { BackgroundMusic } from "@/components/background-music";
import { BalloonBackground, PageDecorBackground } from "@/components/ui/invitation-decor";

/** Landing page do 1º Aninho do Liam. */
export default function Home() {
  return (
    <>
      <BackgroundMusic />
      <PageDecorBackground />
      <BalloonBackground />
      <Header />
      <main className="relative z-10 bg-transparent">
        <Hero />
        <PhotoGallery />
        <EventDetails />
        <SpaceLayout />
        <MenuSection />
        <EntertainmentSection />
        <ShareSection />
      </main>
      <Footer className="relative z-10" />
    </>
  );
}
