(function () {
  async function request(url, options) {
    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : null;

    if (!response.ok) {
      throw new Error((data && data.message) || "Request failed.");
    }

    return data;
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "No date";
    }

    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function formatNumber(value) {
    const number = Number(value || 0);
    return Number.isFinite(number) ? number.toLocaleString(undefined, { maximumFractionDigits: 1 }) : "0";
  }

  function setMessage(element, message, type) {
    if (!element) {
      return;
    }

    element.textContent = message;
    element.classList.remove("success", "error");

    if (type) {
      element.classList.add(type);
    }
  }

  function setActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        link.classList.add("active");
      }
    });
  }

  window.appUtils = {
    getJSON(url) {
      return request(url);
    },
    postJSON(url, body) {
      return request(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
    },
    deleteJSON(url) {
      return request(url, { method: "DELETE" });
    },
    formatDate,
    formatNumber,
    setMessage
  };

  setActiveNav();
})();
