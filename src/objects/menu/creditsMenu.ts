import k from "../../kaplay";
import { openLink } from "../../util";
import { getFakeMouse } from "../mouse";
import { createMenuButton, fullscreenPanel } from "./ui";

export function addCreditsMenu() {
  const creditsMenu = fullscreenPanel("credits_menu");

  const credits = {
    "Erik G": {
      credit: "Programming, Art & Music",
      link: "https://github.com/ErikGXDev",
    },
    feloex: { credit: "Testing & Feedback", link: "https://github.com/feloex" },
    "KAPLAY Community": {
      credit: "Engine, Support & Motivation",
      link: "https://kaplayjs.com",
    },
    "Kevin MacLeod": {
      credit: "Music (CC-BY-4.0)",
      link: "https://incompetech.com",
    },
  };

  const colors = [
    ["#4e187c", "#7d2da0"],
    ["#004d40", "#00796b"],
    ["#4e187c", "#7d2da0"],
    ["#004d40", "#00796b"],
  ];

  const creditsColor = colors[1];

  const creditsBg = creditsMenu.add([
    k.rect(200, 48, {
      radius: 8,
    }),
    k.color(k.rgb(creditsColor[1])),
    k.outline(8, k.rgb(creditsColor[0])),
    k.pos(0, -250),
    k.anchor("center"),
  ]);

  creditsBg.add([
    k.text("Credits", {
      size: 24,
    }),
    k.color(k.rgb("#ffffff")),
    k.pos(0, 0),
    k.anchor("center"),
  ]);

  Object.entries(credits).forEach(([name, { credit, link }], i) => {
    const lightColor = colors[i][1];
    const darkColor = colors[i][0];

    const rectButton = createMenuButton(
      creditsMenu,
      "",
      k.vec2(0, -150 + 100 * (creditsMenu.children.length - 1)),
      k.vec2(465, 80),
      () => {
        if (link) {
          openLink(link);
        }
      }
    );

    rectButton.color = k.rgb(lightColor);
    rectButton.outline.color = k.rgb(darkColor);

    rectButton.onHover(() => {
      const mouse = getFakeMouse();

      const hintLink = k.add([
        k.pos(0, 64),
        k.rect(180, 32, {
          radius: 8,
        }),
        k.follow(mouse, k.vec2(0, 32)),
        k.color(0, 0, 0),
        k.opacity(0.6),
        k.anchor("center"),
        k.layer("ui"),
        k.z(9),
        "hint_link",
      ]);

      const hintText = hintLink.add([
        k.text(link, {
          size: 16,
        }),
        k.pos(0, 0),
        k.anchor("center"),
      ]);

      hintLink.width = hintText.width + 16;
    });

    rectButton.onHoverEnd(() => {
      k.destroyAll("hint_link");
    });

    rectButton.add([
      k.text(name + ":", {
        size: 24,
      }),
      k.color(k.rgb("#ffffff")),
      k.pos(-220, -16),
      k.anchor("left"),
    ]);

    rectButton.add([
      k.text(credit, {
        size: 20,
      }),
      k.color(k.rgb("#ffffff")),
      k.pos(-220, 16),
      k.anchor("left"),
    ]);
  });

  creditsMenu.onDestroy(() => {
    k.destroyAll("hint_link");
  });
}
