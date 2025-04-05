import Link from "next/link";
import Image from "next/image";
import { BookOpen, ChevronRight } from "lucide-react";
import { BlogSeriesType } from "../../../types/admin";
import { getImageSrc } from "@/utils/imageUtils";

export default function SeriesList({ series }: { series: BlogSeriesType[] }) {
  if (!series || series.length === 0) return null;
  
  // Limit to a maximum of 3 for PC view.
  const displayedSeries = series.slice(0, 3);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center">
        <BookOpen className="mr-2 text-light-accent dark:text-dark-accent" />
        Blog Series
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedSeries.map((item, index) => (
          <Link
            key={item.id}
            href={`/blog/series/${item.slug}`}
            className="group"
          >
            <div className={`bg-glass rounded-xl shadow-elevated effect-3d overflow-hidden border border-light-subtle/10 dark:border-dark-subtle/20 hover:-translate-y-1 transition-all duration-300 h-full ${index !== 0 ? "hidden md:block" : ""}`}>
              <div className="relative h-32 overflow-hidden">
                {item.image ? (
                  <>
                    <Image
                      src={getImageSrc(item.image)}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-light-subtle/10 to-light-subtle/20 dark:from-dark-subtle/10 dark:to-dark-subtle/20"></div>
                )}

                <div className="absolute bottom-2 left-3">
                  <span className="text-xs bg-light-subtle/30 dark:bg-dark-subtle/30 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                    Series
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-light-text dark:text-dark-text group-hover:text-light-accent dark:group-hover:text-dark-accent transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-light-subtle dark:text-dark-subtle mt-2 line-clamp-2">
                  {item.description
                    ? item.description
                        .replace(/[#*_~`]/g, "")
                        .substring(0, 100) +
                      (item.description.length > 100 ? "..." : "")
                    : "A collection of related blog posts"}
                </p>

                <div className="flex items-center mt-4 text-light-accent dark:text-dark-accent text-sm font-medium">
                  Explore series
                  <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile: Show view all if there is more than 1 series */}
      {series.length > 1 && (
        <div className="text-center mt-6 md:hidden">
          <Link
            href="/blog?category=series"
            className="inline-flex items-center text-light-accent dark:text-dark-accent hover:underline"
          >
            View all series
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      )}

      {/* Desktop: Show view all if there are more than 3 series */}
      {series.length > 3 && (
        <div className="text-center mt-6 hidden md:flex">
          <Link
            href="/blog?category=series"
            className="inline-flex items-center text-light-accent dark:text-dark-accent hover:underline"
          >
            View all series
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
}
