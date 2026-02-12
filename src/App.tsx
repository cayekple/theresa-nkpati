import { useEffect, useState, useRef } from 'react';

export default function App() {
  const [lightbox, setLightbox] = useState<{ open: boolean; src: string; alt: string; index: number }>({
    open: false, src: '', alt: '', index: -1
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [bioModalOpen, setBioModalOpen] = useState(false);

  const prevFocusRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const basePath = import.meta.env.PROD ? '/theresa-nkpati' : '';

  const galleryCategories = [
    {
      title: 'Picture of the Deceased',
      images: [
        { src: `${basePath}/img/1.jpeg`, alt: 'Theresa Yawa Nkpati' },
        { src: `${basePath}/img/7.jpeg`, alt: 'Theresa Yawa Nkpati' },
      ]
    },
    {
      title: 'Daughters',
      images: [
        { src: `${basePath}/img/2.jpeg`, alt: 'Daughters of Theresa Yawa Nkpati' },
        { src: `${basePath}/img/3.jpeg`, alt: 'Daughters of Theresa Yawa Nkpati' },
        { src: `${basePath}/img/4.jpeg`, alt: 'Daughters of Theresa Yawa Nkpati' },
      ]
    },
    {
      title: 'Grandchildren',
      images: [
        { src: `${basePath}/img/3.jpeg`, alt: 'Grandchildren of Theresa Yawa Nkpati' },
        { src: `${basePath}/img/5.jpeg`, alt: 'Grandchildren of Theresa Yawa Nkpati' },
        { src: `${basePath}/img/6.jpeg`, alt: 'Grandchildren of Theresa Yawa Nkpati' },
        { src: `${basePath}/img/8.jpeg`, alt: 'Grandchildren of Theresa Yawa Nkpati' },
      ]
    },
  ];

  const allImages = galleryCategories.flatMap(cat => cat.images);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const onOpenLightboxAt = (index: number) => {
    prevFocusRef.current = document.activeElement as HTMLElement;
    const item = allImages[index];
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
        if (allImages.length > 1) {
          const next = (lightbox.index + 1 + allImages.length) % allImages.length;
          const item = allImages[next];
          setLightbox({ open: true, src: item.src, alt: item.alt, index: next });
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (allImages.length > 1) {
          const prev = (lightbox.index - 1 + allImages.length) % allImages.length;
          const item = allImages[prev];
          setLightbox({ open: true, src: item.src, alt: item.alt, index: prev });
        }
      }
    };
    if (lightbox.open) {
      window.addEventListener('keydown', onKey);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox.open, lightbox.index, allImages]);

  useEffect(() => {
    let ticking = false;
    const ids = ['home', 'songs', 'gallery'];
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
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm dark:bg-gray-900/95 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="#home" className="text-xl font-bold text-gray-900 dark:text-white transition-colors hover:text-gray-700 dark:hover:text-gray-300">
            Theresa Yawa Nkpati
          </a>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex space-x-2 text-sm">
              <a href="#home" className={linkClass('home')}>Home</a>
              <a href="#songs" className={linkClass('songs')}>Songs</a>
              <a href="#gallery" className={linkClass('gallery')}>Gallery</a>
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
              <a href="#songs" onClick={() => setMenuOpen(false)} className={linkClass('songs')}>Songs</a>
              <a href="#gallery" onClick={() => setMenuOpen(false)} className={linkClass('gallery')}>Gallery</a>
            </div>
          </div>
        )}
      </nav>

      <main id="mainContent">
        {/* Hero and Biography Combined Section */}
        <section id="home" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
                Funeral Arrangement
              </h1>
              <div className="h-1 w-24 bg-gray-300 dark:bg-gray-700 mx-auto mb-6 rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Theresa Yawa Nkpati
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 font-light tracking-wide mb-6">
                1968 – 2026
              </p>
              <div className="max-w-2xl mx-auto space-y-2">
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 font-medium">
                  📍 Venue: Kwamekrom Kingdom Hall
                </p>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 font-medium">
                  📅 Date: 21st February 2026
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid md:grid-cols-[420px_1fr] gap-10 md:gap-16 lg:gap-20 items-start">
              {/* Left Column - Image */}
              <div className="mx-auto md:mx-0 md:sticky md:top-24 animate-slide-in-left">
                <div className="w-full max-w-md">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gray-900/5 dark:ring-white/10">
                    <img
                      src={`${basePath}/img/1.jpeg`}
                      alt="Theresa Yawa Nkpati"
                      className="w-full object-cover"
                    />
                  </div>
                  <p className="text-base sm:text-lg italic text-gray-700 dark:text-gray-300 mt-8 text-center leading-relaxed px-4">
                    &quot;An illustrious daughter, devoted mother, and steadfast servant of Jehovah&quot;
                  </p>
                </div>
              </div>

              {/* Right Column - Biography */}
              <div className="animate-slide-in-right">
                <h3 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
                  Biography
                </h3>
                {/* Desktop: Full text visible */}
                <div className="hidden md:block prose prose-lg max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 leading-relaxed space-y-6 text-justify">
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
                {/* Mobile: Preview with Read More button */}
                <div className="md:hidden">
                  <div className="prose prose-lg max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 text-justify">
                    <p>
                      Theresa Yawa Nkpati, an illustrious daughter, devoted mother, and steadfast servant of Jehovah, was born in 1968 at Aboabonyigbe, Bowiri, in the Oti Region of Ghana...
                    </p>
                  </div>
                  <button
                    onClick={() => setBioModalOpen(true)}
                    className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                  >
                    Read Full Biography
                  </button>
                </div>
              </div>
            </div>

            {/* Program Section - Moved here after Biography */}
            <div className="mt-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                  Program
                </h2>
                <div className="h-1 w-20 bg-gray-300 dark:bg-gray-700 mx-auto rounded-full"></div>
              </div>
              <div className="max-w-4xl mx-auto bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-10 shadow-lg">
                {/* Zoom Meeting Info */}
                <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <span>🔗</span>
                    Join via Zoom
                  </h3>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p className="text-sm sm:text-base">
                      Unable to attend in person? Join the funeral service remotely via Zoom.
                    </p>
                    <a
                      href="https://wacren.zoom.us/j/63785560730?pwd=46ibQzwUy0syrgdvobXYon5aRmu6jD.1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
                    >
                      Join Zoom Meeting
                    </a>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 -mx-4 px-4 transition-colors duration-200 rounded-lg">
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">Chairman&apos;s remarks</span>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">9:00 am</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 -mx-4 px-4 transition-colors duration-200 rounded-lg">
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">Opening song 3 and prayer</span>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">9:05 am</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 -mx-4 px-4 transition-colors duration-200 rounded-lg">
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">Funeral discourse</span>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">9:10 am</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 -mx-4 px-4 transition-colors duration-200 rounded-lg">
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">Closing song 151 and prayer</span>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">9:40 am</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 -mx-4 px-4 py-2 transition-colors duration-200 rounded-lg">
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">Chairman&apos;s closing remarks</span>
                    <span className="text-gray-600 dark:text-gray-400 font-medium"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Songs Section */}
        <section id="songs" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Songs
              </h2>
              <div className="h-1 w-20 bg-gray-300 dark:bg-gray-700 mx-auto rounded-full"></div>
            </div>
            <div className="space-y-10">
              {/* Song 3 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900 dark:text-white text-center">
                  Song 3 - Our Strength, Our Hope, Our Confidence
                </h3>
                <p className="italic text-sm text-gray-600 dark:text-gray-400 mb-8 text-center">(Opening Song - Proverbs 14:26)</p>
                <div className="text-gray-700 dark:text-gray-300 leading-loose text-center max-w-2xl mx-auto">

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

                  <div className="mb-6 py-6 px-4 bg-white dark:bg-gray-950 rounded-xl border-l-4 border-gray-400 dark:border-gray-600">
                    <p className="font-semibold mb-4 text-gray-900 dark:text-white">(CHORUS)</p>
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

                  <div className="py-6 px-4 bg-white dark:bg-gray-950 rounded-xl border-l-4 border-gray-400 dark:border-gray-600">
                    <p className="font-semibold mb-4 text-gray-900 dark:text-white">(CHORUS)</p>
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
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900 dark:text-white text-center">
                  Song 151 - He Will Call
                </h3>
                <p className="italic text-sm text-gray-600 dark:text-gray-400 mb-8 text-center">(Closing Song - Job 14:13-15)</p>
                <div className="text-gray-700 dark:text-gray-300 leading-loose text-center max-w-2xl mx-auto">

                  <div className="mb-6">
                    <p className="font-semibold mb-3 text-gray-900 dark:text-white">Verse 1</p>
                    <p className="mb-1">Life, like a mist, appears for just a day,</p>
                    <p className="mb-1">Then disappears tomorrow.</p>
                    <p className="mb-1">All that we are can quickly fade away,</p>
                    <p className="mb-1">Replaced with tears and sorrow.</p>
                    <p className="mb-1">If a man should die, can he live again?</p>
                    <p className="mb-1">Hear the promise God has made:</p>
                  </div>

                  <div className="mb-6 py-6 px-4 bg-white dark:bg-gray-950 rounded-xl border-l-4 border-gray-400 dark:border-gray-600">
                    <p className="font-semibold mb-4 text-gray-900 dark:text-white">(CHORUS)</p>
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

                  <div className="py-6 px-4 bg-white dark:bg-gray-950 rounded-xl border-l-4 border-gray-400 dark:border-gray-600">
                    <p className="font-semibold mb-4 text-gray-900 dark:text-white">(CHORUS)</p>
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

        {/* Gallery Section */}
        <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Gallery
              </h2>
              <div className="h-1 w-20 bg-gray-300 dark:bg-gray-700 mx-auto rounded-full"></div>
            </div>

            {/* Gallery Categories */}
            <div className="space-y-16">
              {galleryCategories.map((category, catIndex) => {
                const startIndex = galleryCategories.slice(0, catIndex).reduce((sum, cat) => sum + cat.images.length, 0);
                return (
                  <div key={catIndex}>
                    <h3 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
                      {category.title}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {category.images.map((img, imgIndex) => {
                        const globalIndex = startIndex + imgIndex;
                        return (
                          <button
                            key={imgIndex}
                            onClick={() => onOpenLightboxAt(globalIndex)}
                            className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:focus:ring-white ring-1 ring-gray-900/5 dark:ring-white/10"
                          >
                            <img
                              src={img.src}
                              alt={img.alt}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      {/* Biography Modal */}
      {bioModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setBioModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl max-h-[85vh] overflow-y-auto p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setBioModalOpen(false)}
              className="absolute top-4 right-4 text-gray-900 dark:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              aria-label="Close biography"
            >
              ✕
            </button>
            <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white pr-8">
              Biography
            </h3>
            <div className="prose prose-lg max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 leading-relaxed space-y-6 text-justify">
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
      )}

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
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[90vh] w-auto object-contain"
            />
          </div>
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const prev = (lightbox.index - 1 + allImages.length) % allImages.length;
                  const item = allImages[prev];
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
                  const next = (lightbox.index + 1) % allImages.length;
                  const item = allImages[next];
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
