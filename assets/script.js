document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  
    const stickySection = document.querySelector(".steps");
    const stickySectionb = document.querySelector(".outro");
    const stickySectionc = document.querySelector(".hero");
    const stickyHeight = 4500;
    const stickyHeightb = 1000;
    const stickyHeightc = 2500;
    const cards = document.querySelectorAll(".card");
    const countContainer = document.querySelector(".count-container");
    const totalCards = cards.length;
  
    ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${stickyHeight}px`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        positionCards(self.progress);
      },
    });

    ScrollTrigger.create({
      trigger: stickySectionb,
      start: "top top",
      end: `+=${stickyHeightb}px`,
      pin: true,
      pinSpacing: true
    });

    ScrollTrigger.create({
      trigger:".pinned",
      start: "top top",
      endTrigger: ".whitespace",
      end: "bottom top",
      pin: true,
      pinSpacing: false
    });

    ScrollTrigger.create({
      trigger:".header-info",
      start: "top top",
      endTrigger: ".whitespace",
      end: "bottom top",
      pin: true,
      pinSpacing: false
    });

    ScrollTrigger.create({
      trigger:".pinned",
      start: "top top",
      endTrigger: ".header-info",
      end: "bottom bottom",
      onUpdate: (self)=>{
        const rotation = self.progress * 360;
        gsap.to(".revealer", {rotation});
      }
    });

    ScrollTrigger.create({
      trigger:".pinned",
      start: "top top",
      endTrigger: ".header-info",
      end: "bottom bottom",
      onUpdate: (self)=>{
        const progress = self.progress;
        const clipPath = `polygon(
          ${45 - 45 * progress}% ${0 + 0 * progress}%,
          ${55 + 45 * progress}% ${0 + 0 * progress}%,
          ${55 + 45 * progress}% ${100 - 0 * progress}%,
          ${45 - 45 * progress}% ${100 - 0 * progress}%
        )`;
        gsap.to(".revealer-1, .revealer-2",{
          clipPath : clipPath,
          ease: "none",
          duration: 0,
        });
      },
    });

    ScrollTrigger.create({
      trigger:".header-info",
      start: "top top",
      end: "bottom 50%",
      scrub: 1,
      onUpdate: (self)=>{
        const progress = self.progress;
        const left = 35 + 15 * progress;
        gsap.to(".revealer",{
          left: `${left}%`,
          ease: "none",
          duration: 0
        });
      },
    });

   // ScrollTrigger for scaling effect within the "whitespace" section
ScrollTrigger.create({
  trigger: ".whitespace",
  start: "top 50%",
  end: "bottom bottom",
  scrub: 1,
  onUpdate: (self) => {
    const scale = 1 + 12 * self.progress;
    gsap.to(".revealer", {
      scale: scale,
      ease: "none",
      duration: 0,
    });
  },
});

// ScrollTrigger to reset the scale after leaving the next section
ScrollTrigger.create({
  trigger: ".hero", // Replace with the actual class or ID of the next section
  start: "bottom bottom", // Trigger when the next section's bottom leaves the viewport
  onEnter: () => {
    gsap.to(".revealer", {
      scale: 1, // Reset scale
      ease: "none",
      duration: 0.3, // Smooth reset
    });
  },
});



  
    const getRadius = () => {
      return window.innerWidth < 900
        ? window.innerWidth * 7.5
        : window.innerWidth * 2.5;
    };
  
    const arcAngle = Math.PI * 0.4;
    const startAngle = Math.PI / 2 - arcAngle / 2;
  
    function positionCards(progress = 0) {
      const radius = getRadius();
      const totalTravel = 1 + totalCards / 7.5;
      const adjustedProgress = (progress * totalTravel - 1) * 0.75;
  
      cards.forEach((card, i) => {
        const normalizedProgress = (totalCards - 1 - i) / totalCards;
        const cardProgress = normalizedProgress + adjustedProgress;
        const angle = startAngle + arcAngle * cardProgress;
  
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const rotation = (angle - Math.PI / 2) * (180 / Math.PI);
  
        gsap.set(card, {
          x: x,
          y: -y + radius,
          rotation: -rotation,
          transformOrigin: "center center",
        });
      });
    }
  
    // Initial positioning of cards
    positionCards(0);

    let currentCardIndex = 0;
    const options = {
        root: null,
        rootMargin:"0% 0%",
        threshold:0.5,
    };

    const observer = new IntersectionObserver((entries)=>{
        entries.forEach((entry)=>{
            if(entry.isIntersecting){
                lastScrollY = window.scrollY;
                let cardIndex = Array.from(cards).indexOf(entry.target);
                currentCardIndex = cardIndex;
                
                const targetY= 150 - currentCardIndex * 150;
                gsap.to(countContainer,{
                    y: targetY,
                    duration: 0.3,
                    ease: "power1.out",
                    overwrite: true,
                });
            }
        });
    }, options);

    cards.forEach((card)=>{
        observer.observe(card);
    });

    window.addEventListener("resize", () => positionCards(0));
  });


  