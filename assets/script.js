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
    const stickyHeight = 1000;
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
      end: `+=${stickyHeight}px`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        positionCards(self.progress);
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


  