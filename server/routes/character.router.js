const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");

const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/basic", (req, res) => {
  // console.log('im in basic route');

  const query = `
      SELECT * FROM "basic_attacks"
        INNER JOIN "types"
          ON "types"."id" = "basic_attacks"."type_id";
    `;

  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all basic attacks", err);
      res.sendStatus(500);
    });
});

router.get("/attacks", (req, res) => {
  // console.log('im in attacks route');

  const query = `
      SELECT *,
        "types"."id" as "attack_type_id",
        "types"."type_name" as "attack_type_name",
        "types"."effective" as "attack_type_effective",
        "types"."weakness" as "attack_type_weakness",
      FROM "attacks"
        INNER JOIN "types"
          ON "types"."id" = "attacks"."type_id";
    `;

  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all attacks", err);
      res.sendStatus(500);
    });
});

router.get("/all/characters", (req, res) => {
  // console.log('im in character route');

  const query = `
      SELECT * FROM "characters"
        INNER JOIN "types"
          ON "types"."id" = "characters"."type_id";
    `;

  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all charcters", err);
      res.sendStatus(500);
    });
});

router.get("/enemy/:id", (req, res) => {
  //  console.log('req.body', req.body);

  const query = `
	SELECT  "characters"."id",
        "characters"."character_name",
        "characters"."profile_pic",
        "characters"."hp",
        "characters"."stamina",
        "characters"."speed",
        "characters"."battle_pic",
        "character_type"."id" as "character_type_id",
        "character_type"."type_name" as "character_type_name",
        "character_type"."effective" as "character_type_effective",
        "character_type"."weakness" as "character_type_weakness",
        "attacks"."id" as "attacks_id",
        "attacks"."attack_name",
        "attacks"."attack_damage",
        "attacks"."attack_stamina",
        "attacks"."attack_style",
        "attack_type"."id" as "attack_type_id",
        "attack_type"."type_name" as "attack_type_name",
        "attack_type"."effective" as "attack_type_effective",
        "attack_type"."weakness" as "attack_type_weakness",
        "attack_animations"."id" as "attack_animations_id",
        "attack_animations"."animation_name",
        "attack_animations"."max_frames",
        "attack_animations"."hold_time",
        "attack_animations"."fx_img"
            FROM "characters"
        INNER JOIN "types" "character_type"
          ON "character_type"."id" = "characters"."type_id"
        INNER JOIN "attacks"
          ON "attacks"."id" = "characters"."attacks_id"
        INNER JOIN "types" "attack_type"
          ON "attacks"."type_id" = "attack_type"."id"
        INNER JOIN "attack_animations"
        	ON "attacks"."attack_animations_id" = "attack_animations"."id"
        WHERE "characters"."id" = $1;
      `;

  const sqlValues = [req.params.id];

  pool
    .query(query, sqlValues)
    .then((result) => {
      for (const enemy of result.rows) {
        let randomLevel = Math.floor(Math.random() * 5 + 2);

        let multiplier = randomLevel / 5;

        enemy.xp_level = randomLevel;

        enemy.hp *= multiplier;
        enemy.stamina *= multiplier;
        enemy.speed *= multiplier;
        enemy.attack_damage *= multiplier;
      }

      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get the enemies", err);
      res.sendStatus(500);
    });
});

router.use(rejectUnauthenticated);

router.get("/user/characters", (req, res) => {
  // console.log('im in character get');

  const query = `
SELECT "user_characters"."id" as "id",
		    "user_characters"."user_id" as "user_id",
		    "user_characters"."character_id",
        "user_characters"."current_hp" as "hp",
        "user_characters"."current_stamina" as "stamina",
        "user_characters"."max_hp",
        "user_characters"."max_stamina",
        "user_characters"."starter_1",
        "user_characters"."starter_2",
        "user_characters"."new",
        "user_characters"."nickname",
        "user_characters"."xp_level",
		    "characters"."character_name",
		    "characters"."profile_pic",
        "characters"."hp" as "base_hp",
        "characters"."stamina" as "base_stamina",
        "characters"."speed",
        "characters"."battle_pic",
        "character_type"."id" as "character_type_id",
        "character_type"."type_name" as "character_type_name",
        "character_type"."effective" as "character_type_effective",
        "character_type"."weakness" as "character_type_weakness",
        "attacks"."id" as "attacks_id",
        "attacks"."attack_name",
        "attacks"."attack_damage",
        "attacks"."attack_stamina",
        "attacks"."attack_style",
        "attack_type"."id" as "attack_type_id",
        "attack_type"."type_name" as "attack_type_name",
        "attack_type"."effective" as "attack_type_effective",
        "attack_type"."weakness" as "attack_type_weakness",
        "attack_animations"."id" as "attack_animations_id",
        "attack_animations"."animation_name",
        "attack_animations"."max_frames",
        "attack_animations"."hold_time",
        "attack_animations"."fx_img",
        "items"."id" as "item_id",
        "items"."item_name",
        "items"."item_hp",
        "items"."item_stamina",
        "items"."item_pic",
        "items"."item_type",
        "items"."item_speed",
        "items"."item_damage",
        "items"."item_cost",
    	  "items"."item_color"
 FROM "user_characters" 
	  INNER JOIN "characters"
    	ON "user_characters"."character_id" = "characters"."id"
    INNER JOIN "types" "character_type"
      ON "character_type"."id" = "characters"."type_id"
    INNER JOIN "attacks"
      ON "attacks"."id" = "characters"."attacks_id"
    INNER JOIN "types" "attack_type"
      ON "attacks"."type_id" = "attack_type"."id"
    INNER JOIN "attack_animations"
      ON "attacks"."attack_animations_id" = "attack_animations"."id"
    LEFT JOIN "items"
    	ON "user_characters"."item_id" = "items"."id"
	WHERE "user_id" = $1 AND "user_characters"."starter_1" = FALSE AND "user_characters"."starter_2" = FALSE
	ORDER BY "character_id", "id" ASC;
	`;

  const sqlValues = [req.user.id];

  pool
    .query(query, sqlValues)
    .then((result) => {
      for (const character of result.rows) {
        const multiplier = Math.floor(Number(character.xp_level)) / 5;

        const baseHp = character.base_hp * multiplier;
        const baseStamina = character.base_stamina * multiplier;
        const baseSpeed = character.speed * multiplier;
        const baseDamage = character.attack_damage * multiplier;

        // Item boosts
        const itemHp = character.item_id !== null ? character.item_hp : 0;
        const itemStamina =
          character.item_id !== null ? character.item_stamina : 0;
        const itemSpeed = character.item_id !== null ? character.item_speed : 0;
        const itemDamage =
          character.item_id !== null ? character.item_damage : 0;

        // Set max (or scaled) stats
        character.max_hp = Math.round(baseHp) + itemHp;
        character.max_stamina = Math.round(baseStamina) + itemStamina;
        character.speed = Math.round(baseSpeed) + itemSpeed;
        character.attack_damage = Math.round(baseDamage) + itemDamage;

        // Keep current values separate and clamped later
        if (character.hp > character.max_hp) character.hp = character.max_hp;
        if (character.stamina > character.max_stamina)
          character.stamina = character.max_stamina;
      }
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all user characters", err);
      res.sendStatus(500);
    });
});

router.get("/starter", (req, res) => {
  // console.log('im in character get', req.user);

  const query = `
SELECT "user_characters"."id" as "id",
        "user_characters"."user_id" as "user_id",
        "user_characters"."character_id",
        "user_characters"."current_hp" as "hp",
        "user_characters"."current_stamina" as "stamina",
        "user_characters"."max_hp",
        "user_characters"."max_stamina",
        "user_characters"."starter_1",
        "user_characters"."starter_2",
        "user_characters"."new",
        "user_characters"."nickname",
        "user_characters"."xp_level",
        "characters"."character_name",
        "characters"."profile_pic",
        "characters"."hp" as "base_hp",
        "characters"."stamina" as "base_stamina",
        "characters"."speed",
        "characters"."battle_pic",
        "character_type"."id" as "character_type_id",
        "character_type"."type_name" as "character_type_name",
        "character_type"."effective" as "character_type_effective",
        "character_type"."weakness" as "character_type_weakness",
        "attacks"."id" as "attacks_id",
        "attacks"."attack_name",
        "attacks"."attack_damage",
        "attacks"."attack_stamina",
        "attacks"."attack_style",
        "attack_type"."id" as "attack_type_id",
        "attack_type"."type_name" as "attack_type_name",
        "attack_type"."effective" as "attack_type_effective",
        "attack_type"."weakness" as "attack_type_weakness",
        "attack_animations"."id" as "attack_animations_id",
        "attack_animations"."animation_name",
        "attack_animations"."max_frames",
        "attack_animations"."hold_time",
        "attack_animations"."fx_img",
        "items"."id" as "item_id",
        "items"."item_name",
        "items"."item_hp",
        "items"."item_stamina",
        "items"."item_pic",
        "items"."item_type",
        "items"."item_speed",
        "items"."item_damage",
        "items"."item_cost",
    	  "items"."item_color"
 FROM "user_characters" 
	    INNER JOIN "characters"
    	  ON "user_characters"."character_id" = "characters"."id"
      INNER JOIN "types" "character_type"
        ON "character_type"."id" = "characters"."type_id"
    	INNER JOIN "attacks"
        ON "attacks"."id" = "characters"."attacks_id"
      INNER JOIN "types" "attack_type"
        ON "attacks"."type_id" = "attack_type"."id"
      INNER JOIN "attack_animations"
        ON "attacks"."attack_animations_id" = "attack_animations"."id"
      LEFT JOIN "items"
    	  ON "user_characters"."item_id" = "items"."id"
    WHERE "user_characters"."starter_1" = TRUE AND "user_id" = $1 OR "user_characters"."starter_2" = TRUE AND "user_id" = $1
    ORDER BY "starter_1" DESC;
    `;

  const sqlValues = [req.user.id];
  // const sqlValues = [1];

  pool
    .query(query, sqlValues)
    .then((result) => {
      for (const starter of result.rows) {
        const multiplier = Math.floor(Number(starter.xp_level)) / 5;

        const baseHp = starter.base_hp * multiplier;
        const baseStamina = starter.base_stamina * multiplier;
        const baseSpeed = starter.speed * multiplier;
        const baseDamage = starter.attack_damage * multiplier;

        // Item boosts
        const itemHp = starter.item_id !== null ? starter.item_hp : 0;
        const itemStamina = starter.item_id !== null ? starter.item_stamina : 0;
        const itemSpeed = starter.item_id !== null ? starter.item_speed : 0;
        const itemDamage = starter.item_id !== null ? starter.item_damage : 0;

        // Set max (or scaled) stats
        starter.max_hp = Math.round(baseHp) + itemHp;
        starter.max_stamina = Math.round(baseStamina) + itemStamina;
        starter.speed = Math.round(baseSpeed) + itemSpeed;
        starter.attack_damage = Math.round(baseDamage) + itemDamage;

        // Keep current values separate and clamped later
        if (starter.hp > starter.max_hp) starter.hp = starter.max_hp;
        if (starter.stamina > starter.max_stamina)
          starter.stamina = starter.max_stamina;
      }

      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all starters", err);
      res.sendStatus(500);
    });
});

router.post("/new/character", (req, res) => {
  // console.log('req.body', req.body);

  const insertCharacterQuery = `
          INSERT INTO "user_characters" 
            ("user_id", "character_id", "current_hp", "current_stamina", "max_hp", "max_stamina", "xp_level")
            VALUES
            ($1, $2, $3, $4, $5, $6, $7);
        `;
  const insertCharacterValue = [
    req.user.id,
    req.body.characterId,
    req.body.health,
    req.body.stamina,
    req.body.maxHealth,
    req.body.maxStamina,
    req.body.level,
  ];

  pool
    .query(insertCharacterQuery, insertCharacterValue)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("err in sending new character POST route", err);
      res.sendStatus(500);
    });
});

router.put("/buy/new/character", (req, res) => {
  const sqlText = `
        UPDATE "user"
          SET "coins" = "coins" - $1
          WHERE "id" = $2;
          `;

  const sqlValues = [req.body.characterCost, req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error in character.router /buy PUT,", err);
      res.sendStatus(500);
    });
});

router.put("/sell/character", (req, res) => {
  const sqlText = `
        UPDATE "user"
          SET "coins" = "coins" + 10
          WHERE "id" = $1;
          `;

  const sqlValues = [req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error in character.router /sell/character PUT,", err);
      res.sendStatus(500);
    });
});

router.delete("/sell/character", (req, res) => {
  const sqlText = `
    DELETE FROM "user_characters"
      WHERE "id" = $1 AND "user_id" = $2;
      `;

  const sqlValues = [req.body.characterID, req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error in character.router DELETE, deleting character", err);
      res.sendStatus(500);
    });
});

router.put("/new", (req, res) => {
  const sqlText = `
    UPDATE "user_characters"
    SET "new" = FALSE
    WHERE "id" = $1 AND "user_id" = $2;
          `;

  const insertValue = [req.body.characterId, req.user.id];

  pool
    .query(sqlText, insertValue)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error in character.router /new PUT,", err);
      res.sendStatus(500);
    });
});

router.put("/edit/nickname", (req, res) => {
  const sqlText = `
        UPDATE "user_characters"
          SET "nickname" = $1
          WHERE "id" = $2 AND "user_id" = $3;
          `;

  const sqlValues = [
    req.body.newCharacterName,
    req.body.characterID,
    req.user.id,
  ];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error in character.router /edit/nickname PUT,", err);
      res.sendStatus(500);
    });
});

router.put("/starter/clear", (req, res) => {
  // console.log(req.params.id);
  const sqlText = `
    UPDATE "user_characters"
        SET "starter_1" = FALSE 
            WHERE "id" = $1 AND "user_id" = $2;
    `;

  const sqlValues = [req.body.characterId, req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      const sqlText = `
    UPDATE "user_characters"
        SET "starter_2" = FALSE
            WHERE "id" = $1 AND "user_id" = $2;
    `;

      const sqlValues = [req.body.characterId, req.user.id];

      pool.query(sqlText, sqlValues).then((result) => {
        res.sendStatus(201);
      });
    })
    .catch((err) => {
      console.log("Error in 2nd character.router /clear PUT,", err);
      res.sendStatus(500);
    })
    .catch((err) => {
      console.log("Error in character.router /clear PUT,", err);
      res.sendStatus(500);
    });
});

router.put("/starter/update", (req, res) => {
  const { characterId, currentStarter, otherStarter } = req.body;
  const userId = req.user.id;

  const validSlots = ["1", "2", "3"];
  if (
    !validSlots.includes(String(currentStarter)) ||
    (otherStarter && !validSlots.includes(String(otherStarter)))
  ) {
    return res.status(400).send("Invalid starter slot");
  }

  const sqlText = `
    UPDATE "user_characters"
    SET "starter_1" = FALSE,
        "starter_2" = FALSE,
        "starter_3" = FALSE
    WHERE "id" = $1 AND "user_id" = $2;
  `;

  const sqlValues = [characterId, userId];

  pool
    .query(sqlText, sqlValues)
    .then(() => {
      const sqlText = `
        UPDATE "user_characters"
        SET "starter_${currentStarter}" = FALSE
        WHERE "user_id" = $1;
      `;

      const sqlValues = [userId];

      return pool.query(sqlText, sqlValues);
    })
    .then(() => {
      if (otherStarter) {
        const sqlText = `
          UPDATE "user_characters"
          SET "starter_${otherStarter}" = FALSE
          WHERE "id" = $1 AND "user_id" = $2;
        `;

        const sqlValues = [characterId, userId];

        return pool.query(sqlText, sqlValues);
      }
    })
    .then(() => {
      const sqlText = `
        UPDATE "user_characters"
        SET "starter_${currentStarter}" = TRUE
        WHERE "id" = $1 AND "user_id" = $2;
      `;

      const sqlValues = [characterId, userId];

      return pool.query(sqlText, sqlValues);
    })
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error("Error in dynamic starter update:", err);
      res.sendStatus(500);
    });
});

router.put("/use/item", (req, res) => {
  //  console.log('req.body', req.body);

  const sqlText = `
          UPDATE "user_inventory"
          SET "number" = "number" - 1
            WHERE "user_id" = $1 AND "id" = $2;
            `;

  const insertValue = [req.user.id, req.body.itemBeingUsed.id];

  pool
    .query(sqlText, insertValue)
    .then((result) => {
      const hpToAdd = req.body.itemBeingUsed.item_hp || 0;
      const staminaToAdd = req.body.itemBeingUsed.item_stamina || 0;

      const updatedHp = Math.min(
        req.body.starter.hp + hpToAdd,
        req.body.starter.max_hp
      );
      const updatedStamina = Math.min(
        req.body.starter.stamina + staminaToAdd,
        req.body.starter.max_stamina
      );

      const insertNewUserQuery = `
                UPDATE "user_characters"
                SET "current_hp" = $1, "current_stamina" = $2
                WHERE "user_id" = $3 AND "id" = $4
                `;

      const insertValue = [
        updatedHp,
        updatedStamina,
        req.user.id,
        req.body.starter.id,
      ];

      pool.query(insertNewUserQuery, insertValue).then((result) => {
        res.sendStatus(201);
      });
    })
    .catch((err) => {
      // catch for second query
      console.log("in the second", err);
      res.sendStatus(500);
    })
    .catch((err) => {
      console.log("Error in inventory.router /use/item PUT,", err);
      res.sendStatus(500);
    });
});

router.put("/heal/starters", (req, res) => {
  const sqlText = `
        UPDATE "user_characters"
          SET "current_hp" = "max_hp", "current_stamina" = "max_stamina"
          WHERE "user_id" = $1 AND ("starter_1" = TRUE OR "starter_2" = TRUE OR "starter_3" = TRUE);
          `;

  const sqlValues = [req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error in character.router /heal/starters PUT,", err);
      res.sendStatus(500);
    });
});

module.exports = router;
