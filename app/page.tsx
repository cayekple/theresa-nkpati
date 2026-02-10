'use client';

import Image from "next/image";
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [lightbox, setLightbox] = useState<{ open: boolean; src: string; alt: string; index: number }>({
    open: false, src: '', alt: '', index: -1
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const prevFocusRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const images = [
    { src: '/img/1.jpeg', alt: 'Theresa Yawa Nkpati 1' },
    { src: '/img/2.jpeg', alt: 'Theresa Yawa Nkpati 2' },
    { src: '/img/3.jpeg', alt: 'Theresa Yawa Nkpati 3' },
    { src: '/img/4.jpeg', alt: 'Theresa Yawa Nkpati 4' },
    { src: '/img/5.jpeg', alt: 'Theresa Yawa Nkpati 5' },
    { src: '/img/6.jpeg', alt: 'Theresa Yawa Nkpati 6' },
    { src: '/img/7.jpeg', alt: 'Theresa Yawa Nkpati 7' },
    { src: '/img/8.jpeg', alt: 'Theresa Yawa Nkpati 8' },
  ];

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const onOpenLightboxAt = (index: number) => {
    prevFocusRef.current = document.activeElement as HTMLElement;
    const item = images[index];
    if (!item) return;
    setLightbox({ open: true, src: item.src, alt: item.alt, index });
  };

  const onCloseLightbox = () => {
    setLightbox({ open: false, src: '', alt: '', index: -1 });
    prevFocusRef.current?.focus?.();
  };

  useEffect(() => {
    if (lightbox.open) {
      closeBtnRef.current?.focus();
    }
  }, [lightbox.open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseLightbox();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (images.length > 1) {
          const next = (lightbox.index + 1 + images.length) % images.length;
          const item = images[next];
          setLightbox({ open: true, src: item.src, alt: item.alt, index: next });
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (images.length > 1) {
          const prev = (lightbox.index - 1 + images.length) % images.length;
          const item = images[prev];
          setLightbox({ open: true, src: item.src, alt: item.alt, index: prev });
        }
      }
    };
    if (lightbox.open) {
      window.addEventListener('keydown', onKey);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox.open, lightbox.index, images]);

  useEffect(() => {
    let ticking = false;
    const ids = ['home', 'gallery', 'songs', 'program'];
    const getActive = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const offset = 120;
      const targetY = y + offset;
      let current = 'home';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        if (top <= targetY) current = id;
        else break;
      }
      return current;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || document.documentElement.scrollTop || 0;
          setShowScrollTop(y > 300);
          const current = getActive();
          setActiveSection((prev) => (prev !== current ? current : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const baseNav = "rounded-md px-3 py-2 transition-colors hover:text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:hover:text-white dark:hover:bg-gray-700";
  const isActiveId = (id: string) => activeSection === id;
  const linkClass = (id: string) => `${baseNav} ${isActiveId(id) ? 'text-gray-900 font-semibold bg-gray-100 dark:text-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans dark:bg-gray-950 dark:text-white">
      <a href="#mainContent" className="absolute left-[-9999px] focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:text-gray-900 focus:px-3 focus:py-2 focus:rounded-md focus:shadow">
        Skip to content
      </a>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="#home" className="text-xl font-bold text-gray-900 dark:text-white">
            Theresa Yawa Nkpati
          </a>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex space-x-2 text-sm">
              <a href="#home" className={linkClass('home')}>Home</a>
              <a href="#gallery" className={linkClass('gallery')}>Gallery</a>
              <a href="#songs" className={linkClass('songs')}>Songs</a>
              <a href="#program" className={linkClass('program')}>Program</a>
            </div>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex flex-col space-y-1 px-4 py-3">
              <a href="#home" onClick={() => setMenuOpen(false)} className={linkClass('home')}>Home</a>
              <a href="#gallery" onClick={() => setMenuOpen(false)} className={linkClass('gallery')}>Gallery</a>
              <a href="#songs" onClick={() => setMenuOpen(false)} className={linkClass('songs')}>Songs</a>
              <a href="#program" onClick={() => setMenuOpen(false)} className={linkClass('program')}>Program</a>
            </div>
          </div>
        )}
      </nav>

      <main id="mainContent">
        {/* Hero and Biography Combined Section */}
        <section id="home" className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                In Loving Memory
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                Theresa Yawa Nkpati
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                1968 – 2026
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid md:grid-cols-[400px_1fr] gap-8 md:gap-12 items-start">
              {/* Left Column - Image */}
              <div className="mx-auto md:mx-0 md:sticky md:top-24">
                <div className="w-full max-w-md">
                  <Image
                    src="/img/1.jpeg"
                    alt="Theresa Yawa Nkpati"
                    width={400}
                    height={400}
                    className="rounded-lg shadow-lg w-full"
                    priority
                  />
                  <p className="text-base italic text-gray-700 dark:text-gray-300 mt-6 text-center">
                    &quot;An illustrious daughter, devoted mother, and steadfast servant of Jehovah&quot;
                  </p>
                </div>
              </div>

              {/* Right Column - Biography */}
              <div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  Biography
                </h3>
                <div className="prose prose-lg max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                  <p>
                    Theresa Yawa Nkpati, an illustrious daughter, devoted mother, and steadfast servant of Jehovah, was born in 1968 at Aboabonyigbe, Bowiri, in the Oti Region of Ghana. She was the cherished daughter of Mr. Martin Yao Nkpati and Madam Christine Kpeglo, natives of Tsieve in Togo. Theresa was the fifth of six siblings. Sadly, three of her siblings predeceased her, including one who passed away at a very young age. At the time of her passing, she was survived by two older siblings. She also had six half-siblings.
                  </p>
                  <p>
                    In pursuit of a better life, her parents migrated to Ghana, where they engaged in cocoa farming. Through this upbringing, Theresa learned the values of resilience, hard work, and perseverance—qualities that shaped her character throughout her life.
                  </p>
                  <p>
                    Theresa began her primary education at Takrabe. At the age of eight, she later moved to Sogakope to live with her elder sister, where she continued and completed her primary education from 1975 to 1984. When her sister later got married and travelled to Nigeria, Theresa moved to Togo to stay with her aunt, who trained her in trading. This experience sharpened her entrepreneurial skills and instilled in her discipline, prudence, and a strong work ethic.
                  </p>
                  <p>
                    In 1988, Theresa entered into matrimony with Kofi Senyo Attivor. Their union was blessed with two daughters, Akpedze Attivor and Irene Attivor, who became the center of her love, care, and dedication. She was also blessed with three grandchildren, who brought her great joy and pride. In 1998, she was diagnosed with diabetes. Through resilience, determination, and consistent medical care, she managed the condition successfully and continued to live a productive and purposeful life.
                  </p>
                  <p>
                    Upon returning to Ghana, Theresa first focused on restoring her health. She later engaged in farming for some time, made a brief return to Togo, and eventually settled permanently in Ghana. It was after this period that she established and operated a provision shop, dealing in assorted goods. Her honesty, diligence, and commitment earned her the respect of customers and members of the community while faithfully providing for her family.
                  </p>
                  <p>
                    Theresa was deeply spiritual. Her personal study of the Bible with Jehovah&apos;s Witnesses convinced her that Jehovah God is one, that the dead are conscious of nothing, and that there is a sure hope of a resurrection. She symbolized her dedication to Jehovah by baptism on 21st December 2002. From then on, she zealously participated in the preaching and teaching work, sharing Bible truths that brought comfort and hope to many. It was her heartfelt desire that her daughters would one day make a personal decision to worship Jehovah and serve Him faithfully.
                  </p>
                  <p>
                    Theresa Yawa Nkpati lived a life marked by faith, perseverance, integrity, and love. Her fine example continues to inspire all who knew her.
                  </p>
                  <p>
                    She peacefully fell asleep in death on Wednesday, 21st January 2026. Though her passing has left a deep void, her legacy of love, integrity, and devotion to Jehovah remains alive in the hearts of her children, grandchildren, family, friends, and the wider community.
                  </p>
                  <p>
                    During her lifetime, scriptures such as Revelation 21:3–4, 1 Corinthians 15:55, and John 5:28–29 brought Theresa deep comfort and strengthened her faith. These reassuring Bible promises reminded her that Jehovah lovingly intends to wipe away every tear, bring an end to pain, mourning, and death, and grant a sure resurrection hope to those asleep in death. Today, these same scriptures continue to provide powerful consolation to all who mourn her passing, strengthening their confidence that death is not the end and that Jehovah&apos;s promises will surely be fulfilled.
                  </p>
                  <p>
                    These precious Bible promises shaped Theresa&apos;s faith, sustained her through life&apos;s trials, and gave her unwavering confidence in Jehovah&apos;s loving purpose. It is her heartfelt hope that all who reflect on these scriptures—especially her beloved daughters and grandchildren—will draw comfort, build strong faith, and look forward with certainty to the fulfillment of Jehovah&apos;s promises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
              Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => onOpenLightboxAt(i)}
                  className="relative aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Songs Section */}
        <section id="songs" className="py-16 px-4 bg-white dark:bg-gray-950">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
              Songs
            </h2>
            <div className="space-y-8">
              {/* Song 3 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white text-center">
                  Song 3 - Our Strength, Our Hope, Our Confidence
                </h3>
                <p className="italic text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">(Opening Song - Proverbs 14:26)</p>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-2xl mx-auto">

                  <div className="mb-6">
                    <p className="font-semibold mb-3 text-gray-900 dark:text-white">Verse 1</p>
                    <p className="mb-1">O Jehovah, you have given us</p>
                    <p className="mb-1">a hope that we hold dear.</p>
                    <p className="mb-1">It&apos;s a hope we find so thrilling</p>
                    <p className="mb-1">we want the world to hear.</p>
                    <p className="mb-1">But at times this life&apos;s anxieties</p>
                    <p className="mb-1">are the cause of fears within,</p>
                    <p className="mb-1">And the hope that burned so brightly</p>
                    <p className="mb-1">has suddenly grown dim.</p>
                  </div>

                  <div className="mb-6 py-4 bg-white dark:bg-gray-950 rounded">
                    <p className="font-semibold mb-3 text-gray-900 dark:text-white">(CHORUS)</p>
                    <p className="mb-1">You&apos;re our strength, you&apos;re our hope,</p>
                    <p className="mb-1">you&apos;re our confidence.</p>
                    <p className="mb-1">Whatever we lack, you supply.</p>
                    <p className="mb-1">When we preach, when we teach,</p>
                    <p className="mb-1">we have confidence</p>
                    <p className="mb-1">because it&apos;s on you we rely.</p>
                  </div>

                  <div className="mb-6">
                    <p className="font-semibold mb-3 text-gray-900 dark:text-white">Verse 2</p>
                    <p className="mb-1">So Jehovah, please instill in us</p>
                    <p className="mb-1">a heart that won&apos;t forget,</p>
                    <p className="mb-1">For you&apos;ve always been our comfort</p>
                    <p className="mb-1">when troubled times we&apos;ve met.</p>
                    <p className="mb-1">And these thoughts that lift and strengthen us</p>
                    <p className="mb-1">can revive that dying flame,</p>
                    <p className="mb-1">For they fill our hearts with courage</p>
                    <p className="mb-1">to speak about your name.</p>
                  </div>

                  <div className="py-4 bg-white dark:bg-gray-950 rounded">
                    <p className="font-semibold mb-3 text-gray-900 dark:text-white">(CHORUS)</p>
                    <p className="mb-1">You&apos;re our strength, you&apos;re our hope,</p>
                    <p className="mb-1">you&apos;re our confidence.</p>
                    <p className="mb-1">Whatever we lack, you supply.</p>
                    <p className="mb-1">When we preach, when we teach,</p>
                    <p className="mb-1">we have confidence</p>
                    <p className="mb-1">because it&apos;s on you we rely.</p>
                  </div>
                </div>
              </div>

              {/* Song 151 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white text-center">
                  Song 151 - He Will Call
                </h3>
                <p className="italic text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">(Closing Song - Job 14:13-15)</p>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-2xl mx-auto">

                  <div className="mb-6">
                    <p className="font-semibold mb-3 text-gray-900 dark:text-white">Verse 1</p>
                    <p className="mb-1">Life, like a mist, appears for just a day,</p>
                    <p className="mb-1">Then disappears tomorrow.</p>
                    <p className="mb-1">All that we are can quickly fade away,</p>
                    <p className="mb-1">Replaced with tears and sorrow.</p>
                    <p className="mb-1">If a man should die, can he live again?</p>
                    <p className="mb-1">Hear the promise God has made:</p>
                  </div>

                  <div className="mb-6 py-4 bg-white dark:bg-gray-950 rounded">
                    <p className="font-semibold mb-3 text-gray-900 dark:text-white">(CHORUS)</p>
                    <p className="mb-1">He will call; The dead will answer.</p>
                    <p className="mb-1">They will live at his command.</p>
                    <p className="mb-1">For he will have a longing</p>
                    <p className="mb-1">For the work of his own hand.</p>
                    <p className="mb-1">So have faith, and do not wonder,</p>
                    <p className="mb-1">For our God can make us stand.</p>
                    <p className="mb-1">And we will live forever,</p>
                    <p className="mb-1">As the work of his own hand.</p>
                  </div>

                  <div className="mb-6">
                    <p className="font-semibold mb-3 text-gray-900 dark:text-white">Verse 2</p>
                    <p className="mb-1">Friends of our God, though they may pass away,</p>
                    <p className="mb-1">Will never be forsaken.</p>
                    <p className="mb-1">All those asleep who in God&apos;s mem&apos;ry stay,</p>
                    <p className="mb-1">From death he will awaken.</p>
                    <p className="mb-1">Then we&apos;ll come to see all that life can be:</p>
                    <p className="mb-1">Paradise eternally.</p>
                  </div>

                  <div className="py-4 bg-white dark:bg-gray-950 rounded">
                    <p className="font-semibold mb-3 text-gray-900 dark:text-white">(CHORUS)</p>
                    <p className="mb-1">He will call; The dead will answer.</p>
                    <p className="mb-1">They will live at his command.</p>
                    <p className="mb-1">For he will have a longing</p>
                    <p className="mb-1">For the work of his own hand.</p>
                    <p className="mb-1">So have faith, and do not wonder,</p>
                    <p className="mb-1">For our God can make us stand.</p>
                    <p className="mb-1">And we will live forever,</p>
                    <p className="mb-1">As the work of his own hand.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Section */}
        <section id="program" className="py-16 px-4 bg-white dark:bg-gray-950">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
              Program
            </h2>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
                  <span className="font-semibold text-gray-900 dark:text-white">Chairman&apos;s remarks</span>
                  <span className="text-gray-600 dark:text-gray-400">9:00 am</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
                  <span className="font-semibold text-gray-900 dark:text-white">Opening song 3 and prayer</span>
                  <span className="text-gray-600 dark:text-gray-400">9:05 am</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
                  <span className="font-semibold text-gray-900 dark:text-white">Funeral discourse</span>
                  <span className="text-gray-600 dark:text-gray-400">9:10 am</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
                  <span className="font-semibold text-gray-900 dark:text-white">Closing song 151 and prayer</span>
                  <span className="text-gray-600 dark:text-gray-400">9:40 am</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-white">Chairman&apos;s closing remarks</span>
                  <span className="text-gray-600 dark:text-gray-400"></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={onCloseLightbox}
        >
          <button
            ref={closeBtnRef}
            onClick={onCloseLightbox}
            className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close lightbox"
          >
            ✕
          </button>
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              width={1200}
              height={1200}
              className="max-h-[90vh] w-auto object-contain"
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const prev = (lightbox.index - 1 + images.length) % images.length;
                  const item = images[prev];
                  setLightbox({ open: true, src: item.src, alt: item.alt, index: prev });
                }}
                className="absolute left-4 text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const next = (lightbox.index + 1) % images.length;
                  const item = images[next];
                  setLightbox({ open: true, src: item.src, alt: item.alt, index: next });
                }}
                className="absolute right-4 text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gray-900 text-white w-12 h-12 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-white"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white text-center">
        <p className="text-sm">
          In loving memory of Theresa Yawa Nkpati (1968 - 2026)
        </p>
        <p className="text-xs mt-2 text-gray-400">
          May her memory continue to inspire us all
        </p>
      </footer>
    </div>
  );
}
