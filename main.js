(() => {
  const app = document.getElementById("lycaxia-app");
  const data = document.getElementById("document-data");
  const originalMain = document.getElementById("document-main");
  const content = document.getElementById("document-content");
  const loader = document.getElementById("document-loader");

  const hideLoader = () => {
    loader?.classList.add("is-hidden");
    setTimeout(() => loader?.remove(), 300);
  };

  if (!app || !data || !originalMain || !content) {
    hideLoader();
    return;
  }

  const info = {
    title: data.dataset.title || document.title || "Dokumen Digital",
    description: data.dataset.description || "",
    category: data.dataset.category || "Dokumen",
    published: data.dataset.published || "",
    updated: data.dataset.updated || "",
    author: data.dataset.author || "",
    cover: data.dataset.cover || ""
  };

  const setMeta = (attribute, key, value) => {
    let meta = document.head.querySelector(
      `meta[${attribute}="${key}"]`
    );

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(attribute, key);
      document.head.append(meta);
    }

    meta.content = value;
  };

  const updateMetadata = () => {
    const description =
      info.description || "Dokumen digital yang diterbitkan melalui Lycaxia E-Docx.";

    document.title = info.title;

    setMeta("name", "description", description);
    setMeta("property", "og:title", info.title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "Lycaxia E-Docx");
    setMeta("property", "og:url", window.location.href);
    setMeta("property", "og:image", info.cover);
    setMeta("property", "og:image:alt", `Sampul dokumen ${info.title}`);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", info.title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", info.cover);
  };

  updateMetadata();

  const setImageActions = (root = content) => {
    root.querySelectorAll("img").forEach((image) => {
      image.setAttribute("onclick", "lyp.viewImg(this)");
      image.style.cursor = "zoom-in";
    });
  };

  setImageActions();

  const imageObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        if (node.matches("img")) {
          node.setAttribute("onclick", "lyp.viewImg(this)");
          node.style.cursor = "zoom-in";
        }

        setImageActions(node);
      });
    });
  });

  imageObserver.observe(content, {
    childList: true,
    subtree: true
  });

  const el = (tag, className = "", text) => {
    const node = document.createElement(tag);

    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;

    return node;
  };

  const link = (text, href, className = "") => {
    const node = el("a", className, text);
    node.href = href;
    return node;
  };

  const notify = (icon, message) => {
    if (window.lyn && typeof window.lyn.dynamicIsland === "function") {
      window.lyn.dynamicIsland({
        Status: "default",
        Label: icon,
        Mess: message
      });
    }
  };

  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  };

  const header = el("header", "site-header");
  const headerInner = el("div", "header-inner");
  const brand = link("", "../", "brand");
  const brandMark = el("img", "brand-mark");
  brandMark.src = "https://docs.lycaxia.web.id/logo.png";
  brandMark.alt = "Lycaxia";
  brandMark.loading = "eager";
  brandMark.decoding = "async";

  const brandText = el("span", "brand-text", "Lycaxia");
  const brandSub = el("span", "brand-sub", "E-Docx");

  brand.append(brandMark, brandText, brandSub);

  const headerActions = el("div", "header-actions");
  const shareButton = el("button", "share-button");
  shareButton.type = "button";
  shareButton.setAttribute("aria-label", "Bagikan dokumen");
  shareButton.append(
    el("span", "share-icon", "↗"),
    el("span", "", "Bagikan")
  );

  headerActions.append(shareButton);
  headerInner.append(brand, headerActions);
  header.append(headerInner);

  const page = el("div", "page-layout");
  const sidebar = el("aside", "document-sidebar");

  const profilePanel = el("section", "publisher-panel");
  profilePanel.setAttribute("aria-label", "Informasi publisher");

  const profileSummary = el("div", "profile-summary");
  const profileAvatarWrap = el("div", "profile-avatar-wrap");
  const profileNameWrap = el("div", "profile-name-wrap");
  const profileNameLine = el("div", "profile-name-line");
  const profileName = el("strong", "profile-name");
  const verifiedMark = el("span", "verified-mark", "✓");

  verifiedMark.setAttribute("aria-label", "Terverifikasi");

  const profileUsername = el("span", "profile-username");
  const profileBio = el("p", "profile-bio");

  profileNameLine.append(profileName);
  profileNameWrap.append(profileNameLine, profileUsername);
  profileSummary.append(profileAvatarWrap, profileNameWrap);

  const profileExtra = el("div", "profile-extra");
  profileExtra.hidden = true;

  const profileDescription = el("p", "profile-description");
  const profileDetails = el("div", "profile-details");
  const profileWebsiteWrap = el("div", "profile-links");
  const profileSocials = el("div", "profile-socials");

  profileExtra.append(
    profileDescription,
    profileDetails,
    profileWebsiteWrap,
    profileSocials
  );

  const profileMoreButton = el("button", "profile-more-button");
  profileMoreButton.type = "button";
  profileMoreButton.hidden = true;
  profileMoreButton.setAttribute("aria-expanded", "false");

  profileMoreButton.append(
    el("span", "profile-more-label", "Selengkapnya"),
    el("span", "profile-more-icon", "⌄")
  );

  profilePanel.append(
    profileSummary,
    profileBio,
    profileExtra,
    profileMoreButton
  );

  const tocPanel = el("nav", "toc-desktop");
  tocPanel.setAttribute("aria-label", "Navigasi dokumen");

  const tocHeading = el("div", "toc-heading");
  tocHeading.append(
    el("span", "toc-heading-icon", "☷"),
    el("h2", "toc-title", "Daftar Isi")
  );

  const tocList = el("div", "toc-list");
  tocPanel.append(tocHeading, tocList);
  sidebar.append(profilePanel, tocPanel);

  const mainColumn = el("div", "document-column");
  const hero = el("section", "document-hero");

  const breadcrumb = el("div", "document-breadcrumb");
  breadcrumb.append(
    link("Lycaxia E-Docx", "../"),
    el("span", "breadcrumb-separator", "/"),
    el("span", "breadcrumb-current", info.category)
  );

  const category = el("span", "document-category", info.category);
  const title = el("h1", "document-title", info.title);
  const description = el("p", "document-description", info.description);
  const metadata = el("div", "document-metadata");

  if (info.published) {
    metadata.append(
      el("span", "metadata-item", `Diterbitkan ${formatDate(info.published)}`)
    );
  }

  if (info.updated) {
    metadata.append(
      el("span", "metadata-item", `Diperbarui ${formatDate(info.updated)}`)
    );
  }

  hero.append(breadcrumb, category, title);

  if (info.description) hero.append(description);
  if (metadata.childElementCount) hero.append(metadata);

  if (info.cover) {
    const cover = el("img", "document-cover");
    cover.src = info.cover;
    cover.alt = `Sampul dokumen ${info.title}`;
    cover.loading = "eager";
    hero.append(cover);
  }

  const documentTools = el("div", "document-tools");
  const copyButton = el("button", "icon-button", "Salin tautan");

  copyButton.type = "button";
  documentTools.append(copyButton);

  const documentCard = el("section", "document-card");
  content.classList.add("document-body");
  documentCard.append(content);

  mainColumn.append(hero, documentTools, documentCard);

  const footer = el("footer", "site-footer");
  const footerInner = el("div", "footer-inner");

  footerInner.append(
    el("span", "footer-brand", "Lycaxia E-Docx"),
    el("span", "footer-text", "Dokumen digital, satu ruang.")
  );

  footer.append(footerInner);

  const backToTop = el("button", "back-to-top", "↑");
  backToTop.type = "button";
  backToTop.setAttribute("aria-label", "Kembali ke atas");
  backToTop.title = "Kembali ke atas";

  page.append(sidebar, mainColumn);
  app.replaceChildren(header, page, footer, backToTop);

  const renderProfile = (profile) => {
    const displayName =
      profile.name || profile.fullName || profile.username || info.author;

    profileName.textContent = displayName;
    profileUsername.textContent = `@${profile.username || info.author}`;
    profileBio.textContent = profile.bio || "";

    if (profile.verified) {
      if (!verifiedMark.isConnected) {
        profileNameLine.append(verifiedMark);
      }
    } else {
      verifiedMark.remove();
    }

    profileAvatarWrap.replaceChildren();

    if (profile.avatar) {
      const avatar = el("img", "profile-avatar");
      avatar.src = profile.avatar;
      avatar.alt = `Foto profil ${displayName}`;
      avatar.loading = "lazy";
      profileAvatarWrap.append(avatar);
    } else {
      const initials = displayName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();

      profileAvatarWrap.append(
        el("span", "profile-avatar-fallback", initials)
      );
    }

    profileDescription.textContent =
      profile.description || "Informasi profil publisher belum tersedia.";

    profileDetails.replaceChildren();

    [
      ["Nama lengkap", profile.fullName],
      ["Lokasi", profile.location],
      ["Organisasi", profile.organization],
      ["Pekerjaan", profile.occupation],
      ["Bidang", profile.field],
      ["Bergabung", profile.joined]
    ].forEach(([label, value]) => {
      if (!value) return;

      const item = el("div", "profile-detail");

      item.append(
        el("span", "profile-detail-label", label),
        el("span", "profile-detail-value", value)
      );

      profileDetails.append(item);
    });

    profileWebsiteWrap.replaceChildren();

    const website = profile.website || profile.url;

    if (website) {
      const websiteLink = link(
        "Kunjungi situs ↗",
        website,
        "profile-website"
      );

      websiteLink.target = "_blank";
      websiteLink.rel = "noopener noreferrer";
      profileWebsiteWrap.append(websiteLink);
    }

    if (profile.email) {
      profileWebsiteWrap.append(
        link(
          "Hubungi melalui email",
          `mailto:${profile.email}`,
          "profile-website"
        )
      );
    }

    profileSocials.replaceChildren();

    if (Array.isArray(profile.socials)) {
      profile.socials.forEach((social) => {
        if (!social?.name || !social?.url) return;

        const socialLink = link(
          social.name,
          social.url,
          "social-link"
        );

        socialLink.target = "_blank";
        socialLink.rel = "noopener noreferrer";
        profileSocials.append(socialLink);
      });
    }

    const hasExtra = Boolean(
      profile.description ||
      profileDetails.childElementCount ||
      profileWebsiteWrap.childElementCount ||
      profileSocials.childElementCount
    );

    profileExtra.hidden = true;
    profileExtra.classList.remove("is-open");
    profileExtra.style.height = "0px";

    profilePanel.classList.remove("is-expanded");
    profileMoreButton.hidden = !hasExtra;
    profileMoreButton.setAttribute("aria-expanded", "false");

    profileMoreButton.querySelector(".profile-more-label").textContent =
      "Selengkapnya";
  };

  const renderProfileFallback = () => {
    renderProfile({
      name: info.author,
      username: info.author,
      bio: "Publisher dokumen ini.",
      description: "Informasi profil publisher belum tersedia."
    });
  };

  const loadProfile = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch("./profile.json", {
        cache: "no-cache",
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error("Profil tidak tersedia.");
      }

      const profile = await response.json();

      if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
        throw new Error("Format profil tidak valid.");
      }

      renderProfile(profile);
    } catch {
      renderProfileFallback();
    } finally {
      clearTimeout(timeoutId);
    }
  };

  profileMoreButton.addEventListener("click", () => {
    if (profileMoreButton.hidden) return;

    const expanded =
      profileMoreButton.getAttribute("aria-expanded") !== "true";

    if (expanded) {
      profileExtra.hidden = false;
      profileExtra.style.height = "0px";
      profileExtra.classList.remove("is-open");

      requestAnimationFrame(() => {
        profileExtra.classList.add("is-open");
        profileExtra.style.height = `${profileExtra.scrollHeight}px`;
      });
    } else {
      profileExtra.style.height = `${profileExtra.scrollHeight}px`;
      void profileExtra.offsetHeight;

      profileExtra.classList.remove("is-open");
      profileExtra.style.height = "0px";
    }

    profilePanel.classList.toggle("is-expanded", expanded);

    profileMoreButton.setAttribute("aria-expanded", String(expanded));

    profileMoreButton.querySelector(".profile-more-label").textContent =
      expanded ? "Tampilkan lebih sedikit" : "Selengkapnya";
  });

  profileExtra.addEventListener("transitionend", (event) => {
    if (event.target !== profileExtra || event.propertyName !== "height") {
      return;
    }

    const expanded =
      profileMoreButton.getAttribute("aria-expanded") === "true";

    if (expanded) {
      profileExtra.style.height = "auto";
    } else {
      profileExtra.hidden = true;
    }
  });

  const headingSelector = "h1[id], h2[id], h3[id], h4[id]";

  function renderToc() {
    tocList.replaceChildren();

    const headings = [...content.querySelectorAll(headingSelector)];

    const root = {
      level: 0,
      children: []
    };

    const stack = [root];

    headings.forEach((heading) => {
      const level = Number(heading.tagName.slice(1));

      const node = {
        heading,
        level,
        children: []
      };

      while (
        stack.length > 1 &&
        stack[stack.length - 1].level >= level
      ) {
        stack.pop();
      }

      stack[stack.length - 1].children.push(node);
      stack.push(node);
    });

    function buildNodes(nodes, parent) {
      nodes.forEach((node) => {
        const item = el("div", "toc-node");

        const tocLink = el(
          "a",
          `toc-link toc-level-h${node.level}`,
          node.heading.textContent.trim()
        );

        tocLink.href = `#${node.heading.id}`;
        tocLink.dataset.target = node.heading.id;

        item.append(tocLink);

        if (node.children.length > 0) {
          const children = el("div", "toc-node-children");
          buildNodes(node.children, children);
          item.append(children);
        }

        parent.append(item);
      });
    }

    buildNodes(root.children, tocList);

    tocPanel.hidden = headings.length === 0;
  }

  tocList.addEventListener("click", (event) => {
    const item = event.target.closest(".toc-link");

    if (!item) return;

    event.preventDefault();

    const heading = document.getElementById(item.dataset.target);

    if (!heading) return;

    heading.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start"
    });

    history.replaceState(null, "", `#${heading.id}`);
  });

  const updateActiveToc = () => {
    const headings = [...content.querySelectorAll(headingSelector)];
    let activeId = "";

    headings.forEach((heading) => {
      if (heading.getBoundingClientRect().top <= 145) {
        activeId = heading.id;
      }
    });

    tocList.querySelectorAll(".toc-link").forEach((item) => {
      const active = item.dataset.target === activeId;

      item.classList.toggle("is-active", active);

      if (active) {
        item.setAttribute("aria-current", "location");
      } else {
        item.removeAttribute("aria-current");
      }
    });
  };

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify("✓", "Tautan dokumen berhasil disalin");
    } catch {
      const input = el("textarea");
      input.value = window.location.href;
      input.style.position = "fixed";
      input.style.opacity = "0";

      document.body.append(input);
      input.select();

      const success = document.execCommand("copy");
      input.remove();

      notify(
        success ? "✓" : "!",
        success ? "Tautan berhasil disalin" : "Gagal menyalin tautan"
      );
    }
  };

  shareButton.addEventListener("click", async () => {
    if (!navigator.share) {
      await copyCurrentUrl();
      return;
    }

    try {
      await navigator.share({
        title: info.title,
        text: info.description,
        url: window.location.href
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        await copyCurrentUrl();
      }
    }
  });

  copyButton.addEventListener("click", copyCurrentUrl);

  const updateScrollControls = () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 450);
  };

  window.addEventListener("scroll", updateScrollControls, { passive: true });
  window.addEventListener("scroll", updateActiveToc, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"
    });
  });

  const waitForImages = () => {
    const images = [...document.images].filter(
      (image) => image.loading !== "lazy"
    );

    return Promise.all(
      images.map((image) => {
        if (image.complete) return Promise.resolve();

        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      })
    );
  };

  const waitForPage = () => {
    if (document.readyState === "complete") {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      window.addEventListener("load", resolve, { once: true });
    });
  };

  renderToc();
  renderProfileFallback();
  updateScrollControls();
  updateActiveToc();

  const ready = Promise.all([
    loadProfile(),
    waitForPage(),
    document.fonts?.ready || Promise.resolve()
  ]).then(waitForImages);

  const maximumWait = new Promise((resolve) => {
    setTimeout(resolve, 4000);
  });

  Promise.race([ready, maximumWait]).finally(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(hideLoader);
    });
  });
})();
