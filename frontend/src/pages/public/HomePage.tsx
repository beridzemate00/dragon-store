import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MainNavbar from "../../components/layout/MainNavbar";
import MainFooter from "../../components/layout/MainFooter";
import type { StoreSlug } from "../../types";

const STORE_LOCATIONS: Record<StoreSlug, { lat: number; lng: number }> = {
  lenina: {
    lat: 41.6517,
    lng: 41.6369
  },
  parnavaz: {
    lat: 41.6497,
    lng: 41.6396
  }
};

type NearestResult = {
  storeSlug: StoreSlug;
  distanceKm: number;
} | null;

type GeoStatus = "idle" | "requesting" | "ok" | "error";

function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const HomePage = () => {
  const [nearest, setNearest] = useState<NearestResult>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("error");
      return;
    }

    setGeoStatus("requesting");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        const distances: NearestResult[] = (Object.keys(
          STORE_LOCATIONS
        ) as StoreSlug[]).map((slug) => {
          const s = STORE_LOCATIONS[slug];
          return {
            storeSlug: slug,
            distanceKm: distanceKm(latitude, longitude, s.lat, s.lng)
          };
        });

        const best = distances.reduce((min, cur) =>
          min && min.distanceKm < cur.distanceKm ? min : cur
        );

        setNearest(best);
        setGeoStatus("ok");
      },
      () => {
        setGeoStatus("error");
      },
      {
        enableHighAccuracy: false,
        timeout: 7000
      }
    );
  }, []);

  const getStoreName = (slug: StoreSlug) => {
    if (slug === "lenina") return "Gamsakhurdia";
    return "Parnavaz Mepe";
  };

  const getOtherStore = (slug: StoreSlug): StoreSlug =>
    slug === "lenina" ? "parnavaz" : "lenina";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MainNavbar />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-red-500 to-amber-400 text-white">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Dragon Store – Asian products in Batumi
            </h1>
            <p className="text-lg max-w-xl mb-6">
              Two real stores in Batumi. Order Asian sauces, noodles, snacks and
              drinks online.
            </p>

            <div className="mb-6">
              {geoStatus === "requesting" && (
                <p className="text-sm text-white/80">
                  Detecting your location to find nearest store...
                </p>
              )}

              {geoStatus === "ok" && nearest && (
                <div className="bg-white/10 border border-white/30 rounded-xl p-4 max-w-md">
                  <p className="text-sm mb-1">Nearest store for you:</p>
                  <p className="text-xl font-semibold mb-1">
                    {getStoreName(nearest.storeSlug)}
                  </p>
                  <p className="text-xs text-white/80 mb-3">
                    Approx. distance: {nearest.distanceKm.toFixed(1)} km
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/store/${nearest.storeSlug}`}
                      className="inline-block bg-white text-red-600 px-5 py-2 rounded-full font-semibold text-sm hover:bg-slate-100"
                    >
                      Open nearest store
                    </Link>
                    <Link
                      to={`/store/${getOtherStore(nearest.storeSlug)}`}
                      className="inline-block border border-white text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-white/10"
                    >
                      Open other store
                    </Link>
                  </div>
                </div>
              )}

              {geoStatus === "error" && (
                <p className="text-sm text-white/80">
                  We could not detect your location. Choose store manually:
                </p>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link
                to="/store/lenina"
                className="inline-block bg-white text-red-600 px-5 py-2 rounded-full font-semibold text-sm hover:bg-slate-100"
              >
                Go to “Gamsakhurdia”
              </Link>
              <Link
                to="/store/parnavaz"
                className="inline-block border border-white text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-white/10"
              >
                Go to “Parnavaz Mepe”
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
};

export default HomePage;
