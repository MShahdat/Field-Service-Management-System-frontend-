
import PubRegionLists from "@/components/module/region/pub-region-lists";
import Header from "@/shared/header";

export const metadata = {
  title: "Service regions | FieldDesk",
  description:
    "Browse the service areas covered by FieldDesk managers and technicians.",
};

const RegionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 space-y-4">
        <div className="mb-6 max-w-2xl">
          <p className="text-sm font-medium text-primary">Service coverage</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Find service in your region.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Browse active service areas and see the managers and technicians
            covering each region.
          </p>
        </div>
        <Header label="Regions" />
        <PubRegionLists />
      </section>
    </div>
  );
};

export default RegionPage;
