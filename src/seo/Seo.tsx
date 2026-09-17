// src/seo/Seo.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { metaForPath, SITE_NAME, SITE_URL } from "./pageMeta";

/**
 * Keeps <head> in step with the current route.
 *
 * Rendered once in the persistent shell, outside <Routes>, so it
 * survives navigation and simply reacts to the path changing.
 *
 * It updates the tags index.html already ships rather than appending
 * duplicates - two description tags is worse than one, and Google picks
 * whichever it likes.
 */

const MANAGED = "data-seo-managed";

function upsert(
  selector: string,
  create: () => HTMLElement,
  apply: (el: HTMLElement) => void
) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    el.setAttribute(MANAGED, "true");
    document.head.appendChild(el);
  }
  apply(el);
}

function setNamedMeta(name: string, content: string) {
  upsert(
    `meta[name="${name}"]`,
    () => {
      const el = document.createElement("meta");
      el.setAttribute("name", name);
      return el;
    },
    (el) => el.setAttribute("content", content)
  );
}

function setPropertyMeta(property: string, content: string) {
  upsert(
    `meta[property="${property}"]`,
    () => {
      const el = document.createElement("meta");
      el.setAttribute("property", property);
      return el;
    },
    (el) => el.setAttribute("content", content)
  );
}

function setCanonical(href: string) {
  upsert(
    'link[rel="canonical"]',
    () => {
      const el = document.createElement("link");
      el.setAttribute("rel", "canonical");
      return el;
    },
    (el) => el.setAttribute("href", href)
  );
}

export function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metaForPath(pathname);
    const url = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;

    document.title = meta.title;
    setNamedMeta("description", meta.description);
    setCanonical(url);

    setPropertyMeta("og:type", "website");
    setPropertyMeta("og:site_name", SITE_NAME);
    setPropertyMeta("og:title", meta.title);
    setPropertyMeta("og:description", meta.description);
    setPropertyMeta("og:url", url);

    setNamedMeta("twitter:card", "summary_large_image");
    setNamedMeta("twitter:title", meta.title);
    setNamedMeta("twitter:description", meta.description);

    // One script tag holds this route's schema.org blocks. Replacing its
    // contents on every navigation keeps stale structured data from a
    // previous page out of the document.
    let script = document.getElementById("seo-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "seo-jsonld";
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(
      meta.jsonLd.length === 1 ? meta.jsonLd[0] : meta.jsonLd
    );
  }, [pathname]);

  return null;
}
