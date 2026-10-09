
(() => {
  "use strict";

  const header = document.querySelector("#header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const topButton = document.querySelector("#back-top");

  // 현재 연도
  const yearElement = document.querySelector("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 스크롤 상태에 따라 헤더와 맨 위로 버튼 변경
  function updateScrollUI() {
    const scrolled = window.scrollY > 20;

    header?.classList.toggle("scrolled", scrolled);
    topButton?.classList.toggle("visible", window.scrollY > 450);
  }

  window.addEventListener("scroll", updateScrollUI, {
    passive: true
  });

  updateScrollUI();

  // 모바일 메뉴
  function closeMenu() {
    nav?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "메뉴 열기");
    document.body.classList.remove("menu-open");
  }

  menuButton?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("open") ?? false;

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "메뉴 닫기" : "메뉴 열기"
    );

    document.body.classList.toggle("menu-open", isOpen);
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", event => {
    if (
      nav?.classList.contains("open") &&
      !nav.contains(event.target) &&
      !menuButton?.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // 화면에 들어온 콘텐츠 표시
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  }

  // 전화번호 복사
  const copyButton = document.querySelector("#copy-phone");
  const copyStatus = document.querySelector("#copy-status");
  let statusTimeout;

  async function copyPhoneNumber() {
    const phone = "010-9545-0424";

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(phone);
      } else {
        const textarea = document.createElement("textarea");

        textarea.value = phone;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";

        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand("copy");
        textarea.remove();

        if (!copied) {
          throw new Error("Copy failed");
        }
      }

      if (copyStatus) {
        copyStatus.textContent = "전화번호를 복사했습니다.";
      }
    } catch {
      if (copyStatus) {
        copyStatus.textContent =
          "복사할 수 없습니다. 010-9545-0424를 직접 복사해 주세요.";
      }
    }

    window.clearTimeout(statusTimeout);

    statusTimeout = window.setTimeout(() => {
      if (copyStatus) {
        copyStatus.textContent = "멜리사 영어학원 원장 연락처";
      }
    }, 3500);
  }

  copyButton?.addEventListener("click", copyPhoneNumber);

  // 맨 위로 이동
  topButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth"
    });
  });

  // FAQ: 한 번에 하나의 답변만 열기
  const faqItems = document.querySelectorAll(".faq-list details");

  faqItems.forEach(item => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach(other => {
        if (other !== item) {
          other.open = false;
        }
      });
    });
  });

  // 페이지 내 링크 이동 시 모바일 메뉴 닫기
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      closeMenu();
    });
  });

  // 화면 크기가 데스크톱으로 변경되면 모바일 메뉴 초기화
  window.matchMedia("(min-width: 761px)").addEventListener(
    "change",
    event => {
      if (event.matches) {
        closeMenu();
      }
    }
  );
})();