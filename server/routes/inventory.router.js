const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");

const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/consumable", (req, res) => {
  const query = `
    SELECT "id",
 		"item_name",
 		"item_type",
        "item_hp",
        "item_stamina",
        "item_speed",
        "item_pic",
        "item_cost",
        "item_color"
    FROM "items"
        WHERE "item_type" = 'consumable';
  `;

  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all consumable items", err);
      res.sendStatus(500);
    });
});

router.get("/held", (req, res) => {
  const query = `
    SELECT "id",
 		"item_name",
 		"item_type",
        "item_hp",
        "item_stamina",
        "item_speed",
        "item_damage",
        "item_pic",
        "item_cost",
        "item_color"
    FROM "items"
        WHERE "item_type" = 'held';
  `;

  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all held items", err);
      res.sendStatus(500);
    });
});

router.get("/throwable", (req, res) => {
  const query = `
    SELECT "id",
 		"item_name",
 		"item_type",
        "item_hp",
        "item_stamina",
        "item_speed",
        "item_damage",
        "item_capture_rate",
        "item_pic",
        "item_cost",
        "item_color"
    FROM "items"
        WHERE "item_type" = 'throwable';
  `;

  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all throwable items", err);
      res.sendStatus(500);
    });
});

router.get("/all/items", (req, res) => {
  const query = `
    SELECT "id",
 		    "item_name",
 		    "item_type",
        "item_hp",
        "item_stamina",
        "item_speed",
        "item_damage",
        "item_capture_rate",
        "item_pic",
        "item_cost",
        "item_color"
    FROM "items"
    ORDER BY "id";
  `;

  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all items", err);
      res.sendStatus(500);
    });
});

router.use(rejectUnauthenticated);

router.get("/user/inventory", (req, res) => {
  const query = `
    SELECT "user_inventory"."id" as "id",
            "user_inventory"."user_id" as "user_id",
            "user_inventory"."items_id" as "items_id",
            "user_inventory"."number" as "number",
            "items"."item_name",
            "items"."item_hp",
            "items"."item_stamina",
            "items"."item_pic",
            "items"."item_type",
            "items"."item_speed",
            "items"."item_damage",
            "items"."item_capture_rate",
            "items"."item_cost",
            "items"."item_color"
    FROM "user_inventory"
        INNER JOIN "items"
    ON "user_inventory"."items_id" = "items"."id"
        WHERE "user_id" = $1 AND "user_inventory"."number" > 0 
        ORDER BY "items_id" ASC;
  `;

  const sqlValues = [req.user.id];

  pool
    .query(query, sqlValues)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all users inventory", err);
      res.sendStatus(500);
    });
});

router.get("/user/held", (req, res) => {
  const query = `
    SELECT "user_inventory"."id" as "id",
            "user_inventory"."user_id" as "user_id",
            "user_inventory"."items_id" as "items_id",
            "user_inventory"."number" as "number",
            "items"."item_name",
            "items"."item_hp",
            "items"."item_stamina",
            "items"."item_pic",
            "items"."item_type",
            "items"."item_speed",
            "items"."item_damage",
            "items"."item_cost",
            "items"."item_color"
    FROM "user_inventory"
        INNER JOIN "items"
    ON "user_inventory"."items_id" = "items"."id"
        WHERE "user_id" = $1 AND "user_inventory"."number" > 0 AND "items"."item_type" = 'held'
        ORDER BY "items_id" ASC;
  `;

  const sqlValues = [req.user.id];

  pool
    .query(query, sqlValues)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all users inventory", err);
      res.sendStatus(500);
    });
});

router.get("/user/consumable", (req, res) => {
  const query = `
    SELECT "user_inventory"."id" as "id",
            "user_inventory"."user_id" as "user_id",
            "user_inventory"."items_id" as "items_id",
            "user_inventory"."number" as "number",
            "items"."item_name",
            "items"."item_hp",
            "items"."item_stamina",
            "items"."item_pic",
            "items"."item_type",
            "items"."item_speed",
            "items"."item_damage",
            "items"."item_cost",
            "items"."item_color"
    FROM "user_inventory"
        INNER JOIN "items"
    ON "user_inventory"."items_id" = "items"."id"
        WHERE "user_id" = $1 AND "user_inventory"."number" > 0 AND "items"."item_type" = 'consumable'
        ORDER BY "items_id" ASC;
  `;

  const sqlValues = [req.user.id];

  pool
    .query(query, sqlValues)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all users inventory", err);
      res.sendStatus(500);
    });
});

router.get("/user/throwable", (req, res) => {
  const query = `
    SELECT "user_inventory"."id" as "id",
            "user_inventory"."user_id" as "user_id",
            "user_inventory"."items_id" as "items_id",
            "user_inventory"."number" as "number",
            "items"."item_name",
            "items"."item_hp",
            "items"."item_stamina",
            "items"."item_pic",
            "items"."item_type",
            "items"."item_speed",
            "items"."item_damage",
            "items"."item_capture_rate",
            "items"."item_cost",
            "items"."item_color"
    FROM "user_inventory"
        INNER JOIN "items"
    ON "user_inventory"."items_id" = "items"."id"
        WHERE "user_id" = $1 AND "user_inventory"."number" > 0 AND "items"."item_type" = 'throwable'
        ORDER BY "items_id" ASC;
  `;

  const sqlValues = [req.user.id];

  pool
    .query(query, sqlValues)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all users throwable", err);
      res.sendStatus(500);
    });
});

router.get("/user/battle/items", (req, res) => {
  const query = `
    SELECT "user_inventory"."id" as "id",
            "user_inventory"."user_id" as "user_id",
            "user_inventory"."items_id" as "items_id",
            "user_inventory"."number" as "number",
            "items"."item_name",
            "items"."item_hp",
            "items"."item_stamina",
            "items"."item_pic",
            "items"."item_type",
            "items"."item_speed",
            "items"."item_damage",
            "items"."item_capture_rate",
            "items"."item_cost",
            "items"."item_color"
    FROM "user_inventory"
        INNER JOIN "items"
    ON "user_inventory"."items_id" = "items"."id"
        WHERE "user_id" = $1 AND "user_inventory"."number" > 0 AND ("items"."item_type" = 'throwable' OR "items"."item_type" = 'consumable')
        ORDER BY "items_id" ASC;
  `;

  const sqlValues = [req.user.id];

  pool
    .query(query, sqlValues)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all users battle items", err);
      res.sendStatus(500);
    });
});

router.put("/buy/item", (req, res) => {
  // console.log('req.body', req.body);

  const sqlText = `
    UPDATE "user_inventory"
    SET "number" = "number" + 1
      WHERE "user_id" = $1 AND "items_id" = $2;
      `;

  const insertValue = [req.user.id, req.body.itemId];

  pool
    .query(sqlText, insertValue)
    .then((result) => {
      const insertNewUserQuery = `
                    UPDATE "user"
                      SET "coins" = "coins" - $1
                      WHERE "id" = $2
                      RETURNING "coins";
                      `;

      const insertValue = [req.body.itemCost, req.user.id];

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
      console.log("Error in inventory.router /buy PUT,", err);
      res.sendStatus(500);
    });
});

router.put("/sell/item", (req, res) => {
  //  console.log('req.body', req.body);

  const sqlText = `
        UPDATE "user_inventory"
        SET "number" = "number" - 1
          WHERE "user_id" = $1 AND "items_id" = $2;
          `;

  const insertValue = [req.user.id, req.body.itemId];

  pool
    .query(sqlText, insertValue)
    .then((result) => {
      const insertNewUserQuery = `
            UPDATE "user"
            SET "coins" = "coins" + $1
            WHERE "id" = $2
            RETURNING "coins";
            `;

      const insertValue = [req.body.totalCoins, req.user.id];

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
      console.log("Error in inventory.router /sell/item PUT,", err);
      res.sendStatus(500);
    });
});

router.put("/use/item", (req, res) => {
  // console.log(req.body);

  const sqlText = `
          UPDATE "user_inventory"
          SET "number" = "number" - 1
            WHERE "user_id" = $1 AND "id" = $2;
            `;

  const insertValue = [req.user.id, req.body.items_id];

  pool
    .query(sqlText, insertValue)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error in inventory.router /use/item PUT,", err);
      res.sendStatus(500);
    });
});

router.put("/equip/item", (req, res) => {
  //  console.log('req.body', req.body);

  const sqlText = `
        UPDATE "user_inventory"
        SET "number" = "number" - 1
            WHERE "user_id" = $1 AND "id" = $2;
            `;

  const insertValue = [req.user.id, req.body.itemBeingUsed.id];

  pool.query(sqlText, insertValue).then((result) => {
    let insertNewUserQuery;

    if (req.body.starter.item_id != null) {
      insertNewUserQuery = `
          UPDATE "user_inventory"
        SET "number" = "number" + 1
            WHERE "user_id" = $1 AND "items_id" = $2;
        `;
    } else {
      insertNewUserQuery = `
          UPDATE "user_inventory"
        SET "number" = "number"
            WHERE "user_id" = $1 AND "items_id" = $2;
        `;
    }
    const insertValue = [req.user.id, req.body.starter.item_id];

    pool
      .query(insertNewUserQuery, insertValue)
      .then((result) => {
        const insertNewUserQuery = `
        UPDATE "user_characters"
        SET "item_id" = $1
        WHERE "user_id" = $2 AND "id" = $3
        `;

        const insertValue = [
          req.body.itemBeingUsed.items_id,
          req.user.id,
          req.body.starter.id,
        ];

        pool.query(insertNewUserQuery, insertValue).then((result) => {
          res.sendStatus(201);
        });
      })

      .catch((err) => {
        // catch for third query
        console.log("in the third", err);
        res.sendStatus(500);
      })
      .catch((err) => {
        // catch for second query
        console.log("in the second", err);
        res.sendStatus(500);
      })
      .catch((err) => {
        console.log("Error in inventory.router /equip PUT,", err);
        res.sendStatus(500);
      });
  });
});

router.put("/remove/item", (req, res) => {
  //  console.log('req.body', req.body);

  const sqlText = `
        UPDATE "user_inventory"
        SET "number" = "number" + 1
            WHERE "user_id" = $1 AND "items_id" = $2;
              `;

  const sqlValues = [req.user.id, req.body.itemId];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      const sqlText = `
                UPDATE "user_characters"
                SET "item_id" = NULL
                WHERE "user_id" = $1 AND "id" = $2
                RETURNING id;
                `;

      const sqlValues = [req.user.id, req.body.characterId];

      pool
        .query(sqlText, sqlValues)
        .then((result) => {
          const updatedId = result.rows[0].id;

          const sqlText = `
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
                  json_agg(
    json_build_object(
      'attacks_id', "attacks"."id",
      'attack_name', "attacks"."attack_name",
      'attack_damage', "attacks"."attack_damage",
      'attack_stamina', "attacks"."attack_stamina",
      'attack_style', "attacks"."attack_style",
      'attack_slot_number', "user_character_attacks"."slot_number",
      'attack_is_equipped', "user_character_attacks"."is_equipped",
      'attack_type_id', "attack_type"."id",
      'attack_type_name', "attack_type"."type_name",
      'attack_type_effective', "attack_type"."effective",
      'attack_type_weakness', "attack_type"."weakness",
      'attack_animations_id', "attack_animations"."id",
      'animation_name', "attack_animations"."animation_name",
      'max_frames', "attack_animations"."max_frames",
      'hold_time', "attack_animations"."hold_time",
      'fx_img', "attack_animations"."fx_img"
    )
      ORDER BY "user_character_attacks"."id" ASC
  ) FILTER (WHERE "user_character_attacks"."is_equipped" = TRUE)
    AS attacks,
      json_agg(
    json_build_object(
      'attacks_id', "attacks"."id",
      'attack_name', "attacks"."attack_name",
      'attack_damage', "attacks"."attack_damage",
      'attack_stamina', "attacks"."attack_stamina",
      'attack_style', "attacks"."attack_style",
      'attack_slot_number', "user_character_attacks"."slot_number",
      'attack_is_equipped', "user_character_attacks"."is_equipped",
      'attack_type_id', "attack_type"."id",
      'attack_type_name', "attack_type"."type_name",
      'attack_type_effective', "attack_type"."effective",
      'attack_type_weakness', "attack_type"."weakness",
      'attack_animations_id', "attack_animations"."id",
      'animation_name', "attack_animations"."animation_name",
      'max_frames', "attack_animations"."max_frames",
      'hold_time', "attack_animations"."hold_time",
      'fx_img', "attack_animations"."fx_img"
    )
      ORDER BY "user_character_attacks"."id" ASC
  ) FILTER (WHERE "user_character_attacks"."is_equipped" = FALSE)
    AS stored_attacks,
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
            INNER JOIN "user_character_attacks"
        ON "user_character_attacks"."user_character_id" = "user_characters"."id"
    	INNER JOIN "attacks"
        ON "attacks"."id" = "user_character_attacks"."attack_id"
    INNER JOIN "types" "attack_type"
      ON "attacks"."type_id" = "attack_type"."id"
    INNER JOIN "attack_animations"
      ON "attacks"."attack_animations_id" = "attack_animations"."id"
    LEFT JOIN "items"
    	ON "user_characters"."item_id" = "items"."id"
    WHERE "user_characters"."user_id" = $1 AND "user_characters"."id" = $2
      GROUP BY "user_characters"."id", "characters"."id", "character_type"."id", "items"."id"
      	ORDER BY "character_id", "id" ASC;
    `;

          const sqlValues = [req.user.id, updatedId];

          pool
            .query(sqlText, sqlValues)
            .then((result) => {
              res.send(result.rows[0]);
            })
            .catch((err) => {
              console.log(
                "Error in the third inventory.router /remove/item PUT,",
                err
              );
              res.sendStatus(500);
            });
        })
        .catch((err) => {
          console.log(
            "Error in the second inventory.router /remove/item PUT,",
            err
          );
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log("Error in the first inventory.router /remove/item PUT,", err);
      res.sendStatus(500);
    });
});

module.exports = router;
