window.onload = function () {
  const panelTitle = document.getElementById("panelTitle");
  const panelText = document.getElementById("panelText");
  const panelList = document.getElementById("panelList");
  const tabButtons = document.querySelectorAll(".tab-button");

  const sections = {
    about: {
      title: "About Me",
      text: "I am Eddie, 17 years old, learning from zero and trying to build a better version of myself with real work instead of excuses.",
      items: [
        "I am starting coding from the ground floor.",
        "I want to learn AI, computers, and how to build useful things.",
        "I care about discipline, growth, and becoming stronger over time."
      ]
    },
    building: {
      title: "What I'm Building",
      text: "Right now I am building coding skills, learning how websites work, and turning small daily progress into something real.",
      items: [
        "Mini front-end projects to practice HTML, CSS, and JavaScript.",
        "A stronger foundation in AI and how computers actually work.",
        "A version of myself that can stay consistent even when motivation drops."
      ]
    },
    mindset: {
      title: "My Mindset",
      text: "I do not need to become amazing overnight. I need to keep showing up, keep learning, and keep stacking wins.",
      items: [
        "Discipline beats waiting for the perfect mood.",
        "Progress matters more than looking impressive.",
        "One honest step forward is better than a fake big plan."
      ]
    }
  };

  function renderSection(sectionName) {
    const section = sections[sectionName];

    panelTitle.textContent = section.title;
    panelText.textContent = section.text;
    panelList.innerHTML = "";

    for (let i = 0; i < section.items.length; i += 1) {
      const listItem = document.createElement("li");
      listItem.textContent = section.items[i];
      panelList.appendChild(listItem);
    }

    tabButtons.forEach(function (button) {
      if (button.dataset.tab === sectionName) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      renderSection(button.dataset.tab);
    });
  });

  renderSection("about");
};
