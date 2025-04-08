import { KEventController } from "kaplay";
import { shadowComp } from "./gfx/shadow";
import k from "./kaplay";
import { addCollision, addSlopeCollision } from "./objects/collision";
import { addFinish } from "./objects/finish";
import { addGolfBall } from "./objects/golfBall";
import { addIsland, addIslandWaveLoop } from "./objects/island";
import { addLogicButton } from "./objects/logicButton";
import { addLogicWall } from "./objects/logicWall";
import { addLogicFloor } from "./objects/logicFloor";
import { LdtkEntity } from "./types";
import { addVegetation } from "./objects/bush";
import { addTutorialAnim } from "./objects/special/tutorialAnim";
import { gameState } from "./state";

export function loadMap(id: string) {
  const mapUrl = `maps/${id}`;

  k.loadJSON(`${id}_data`, `${mapUrl}/data.json`);
  k.loadSprite(`${id}_map`, `${mapUrl}/map.png`);
}

export function addMap(
  id: string,
  settings?: {
    noPlayer?: boolean;
    noCollision?: boolean;
    noSpecial?: boolean;
  }
) {
  const mapAsset = k.getAsset(`${id}_data`);

  if (!mapAsset) {
    throw new Error(`Map data not found: ${id}`);
  }

  const mapData = mapAsset.data;

  const doShadows = gameState.settings.shadows === "On";

  const mapObject = k.add([
    k.sprite(`${id}_map`),
    k.layer("map"),
    doShadows ? shadowComp() : {},
    k.pos(0, 0),
    "map",
    {
      mapData,
      nextLevel: "",
      hint: "",
      isEnd: false,
      levelName: "",
      mapCenter: k.vec2(mapData.width / 2, mapData.height / 2),
      islandWaveLoop: null as unknown as KEventController,
    },
  ]);

  mapObject.islandWaveLoop = addIslandWaveLoop();

  getEntities(mapData, "Camera").forEach(({ x, y }: LdtkEntity) => {
    mapObject.mapCenter = k.vec2(x, y);
  });

  if (!settings?.noCollision) {
    getEntities(mapData, "Collision").forEach(
      ({ x, y, width, height }: LdtkEntity) => {
        addCollision(k.vec2(x, y), k.vec2(width, height));
      }
    );

    getEntities(mapData, "Slope_Collision").forEach(
      ({ x, y, customFields }: LdtkEntity) => {
        addSlopeCollision(k.vec2(x, y), customFields.Direction);
      }
    );
  }

  const patches = getEntities(mapData, "Grass_Patch").map(
    ({ x, y }: LdtkEntity) => k.vec2(x, y)
  );
  addIsland(patches);

  const bushes = getEntities(mapData, "Bush").map(({ x, y }: LdtkEntity) =>
    k.vec2(x, y)
  );
  addVegetation(bushes);

  if (!settings?.noPlayer) {
    getEntities(mapData, "Golf_Ball").forEach(({ x, y }: LdtkEntity) => {
      addGolfBall(k.vec2(x, y));
    });
  }

  getEntities(mapData, "Finish").forEach(({ x, y }: LdtkEntity) => {
    addFinish(k.vec2(x, y));
  });

  getEntities(mapData, "Level_Metadata").forEach(
    ({ customFields }: LdtkEntity) => {
      mapObject.hint = customFields.Hint;
      mapObject.levelName = customFields.Level_Name;
      mapObject.nextLevel = customFields.Next_Level;
      mapObject.isEnd = customFields.Is_End;
    }
  );

  getEntities(mapData, "Button").forEach(
    ({ x, y, customFields }: LdtkEntity) => {
      addLogicButton(k.vec2(x, y), customFields.Channel);
    }
  );

  getEntities(mapData, "Logic_Floor").forEach(
    ({ x, y, customFields }: LdtkEntity) => {
      addLogicFloor(k.vec2(x, y), customFields.Channel);
    }
  );

  getEntities(mapData, "Logic_Wall").forEach(
    ({ x, y, customFields }: LdtkEntity) => {
      addLogicWall(k.vec2(x, y), customFields.Channel);
    }
  );

  getEntities(mapData, "Sprite").forEach(
    ({ x, y, customFields }: LdtkEntity) => {
      k.add([
        k.sprite(customFields.sprite),
        k.pos(x, y),
        k.scale(customFields.scaleX, customFields.scaleY),
        k.anchor(customFields.anchor),
        k.z(customFields.zIndex),
        "map_sprite",
      ]);
    }
  );

  if (!settings?.noSpecial) {
    getEntities(mapData, "Special").forEach(
      ({ x, y, customFields }: LdtkEntity) => {
        switch (customFields.id) {
          case "tutorial_anim":
            addTutorialAnim(k.vec2(x, y));
            break;
          default:
            break;
        }
      }
    );
  }

  return mapObject;
}

export function getEntities(mapData: any, id: string) {
  if (mapData.entities[id] === undefined) {
    return [];
  }

  const entities = mapData.entities[id];

  return entities;
}
