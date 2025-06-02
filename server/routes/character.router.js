const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");

const { rejectUnauthenticated } = require('../modules/authentication-middleware');


router.get("/basic", (req, res) => {
  // console.log('im in basic route');

  const query = `
      SELECT * FROM "basic_attacks";
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

router.get("/all/characters", (req, res) => {
  // console.log('im in character route');

  const query = `
      SELECT * FROM "characters";
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
  // console.log('im in enemy get');

  const query = `
SELECT  "characters"."character_name",
        "characters"."profile_pic",
        "characters"."hp",
        "characters"."stamina",
        "characters"."speed",
        "characters"."battle_pic",
        "attacks"."id" as "attacks_id",
        "attacks"."attack_name",
        "attacks"."attack_damage",
        "attacks"."attack_stamina",
        "attacks"."attack_type",
        "attack_animations"."id" as "attack_animations_id",
        "attack_animations"."animation_name",
        "attack_animations"."max_frames",
        "attack_animations"."hold_time",
        "attack_animations"."fx_img"
            FROM "characters"
        INNER JOIN "attacks"
            ON "attacks"."id" = "characters"."attacks_id"
        INNER JOIN "attack_animations"
        	ON "attacks"."attack_animations_id" = "attack_animations"."id"
        WHERE "characters"."id" = $1;
      `;

  const sqlValues = [req.params.id];

  pool
    .query(query, sqlValues)
    .then((result) => {
      let multiplier = 0.2;

      for (const enemy of result.rows) {
        multiplier += Math.floor(Math.random() * 5 + 5);

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

router.get("/user/characters", (req, res) => {
  // console.log('im in character get');

  const query = `
SELECT "user_characters"."id" as "id",
		"user_characters"."user_id" as "user_id",
		"user_characters"."character_id",
        "user_characters"."starter_1",
        "user_characters"."starter_2",
        "user_characters"."new",
        "user_characters"."nickname",
        "user_characters"."xp_level",
		"characters"."character_name",
		"characters"."profile_pic",
		"characters"."hp",
		"characters"."stamina",
        "characters"."speed",
        "characters"."battle_pic",
        "attacks"."id" as "attacks_id",
        "attacks"."attack_name",
        "attacks"."attack_damage",
        "attacks"."attack_stamina",
        "attacks"."attack_type",
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
    	INNER JOIN "attacks"
            ON "attacks"."id" = "characters"."attacks_id"
        INNER JOIN "attack_animations"
        	ON "attacks"."attack_animations_id" = "attack_animations"."id"
    LEFT JOIN "items"
    	ON "user_characters"."item_id" = "items"."id"
	WHERE "user_id" = $1
	ORDER BY "character_id", "id" ASC;
	`;

  const sqlValues = [req.user.id];

  pool
    .query(query, sqlValues)
    .then((result) => {
      for (const character of result.rows) {
        if (character.item_id !== null) {
          character.hp += character.item_hp;
          character.stamina += character.item_stamina;
          character.speed += character.item_speed;
          character.attack_damage += character.item_damage;
        }
      }
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all user characters", err);
      res.sendStatus(500);
    });
});

router.get("/starter", rejectUnauthenticated, (req, res) => {
  // console.log('im in character get', req.user);

  const query = `
SELECT "user_characters"."id" as "id",
        "user_characters"."user_id" as "user_id",
        "user_characters"."character_id",
        "user_characters"."starter_1",
        "user_characters"."starter_2",
        "user_characters"."new",
        "user_characters"."nickname",
        "user_characters"."xp_level",
        "characters"."character_name",
        "characters"."profile_pic",
        "characters"."hp",
        "characters"."stamina",
        "characters"."speed",
        "characters"."battle_pic",
        "attacks"."id" as "attacks_id",
        "attacks"."attack_name",
        "attacks"."attack_damage",
        "attacks"."attack_stamina",
        "attacks"."attack_type",
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
    	INNER JOIN "attacks"
            ON "attacks"."id" = "characters"."attacks_id"
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
      let multiplier = 0.2;

      for (const starter of result.rows) {
        multiplier += Math.floor(starter.xp_level);

        starter.hp *= multiplier;
        starter.stamina *= multiplier;
        starter.speed *= multiplier;
        starter.attack_damage *= multiplier;

        if (starter.item_id !== null) {
          starter.hp += starter.item_hp;
          starter.stamina += starter.item_stamina;
          starter.speed += starter.item_speed;
          starter.attack_damage += starter.item_damage;
        }
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
            ("user_id", "character_id")
            VALUES
            ($1, $2);
        `;
  const insertCharacterValue = [req.user.id, req.body.characterID];

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

router.put("/starter/one/:id", (req, res) => {
  const sqlText = `
    UPDATE "user_characters"
  SET "starter_1" = FALSE
    WHERE "user_id" = $1;
      `;

  const sqlValues = [req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      const insertNewUserQuery = `
        UPDATE "user_characters"
          SET "starter_1" = TRUE
          WHERE "id" = $1 AND "user_id" = $2;
          `;

      const sqlValues = [req.params.id, req.user.id];

      pool.query(insertNewUserQuery, sqlValues).then((result) => {
        res.sendStatus(201);
      });
    })
    .catch((err) => {
      // catch for second query
      console.log("in the second", err);
      res.sendStatus(500);
    })
    .catch((err) => {
      console.log("Error in character.router /startrer 1 PUT,", err);
      res.sendStatus(500);
    });
});

router.put("/starter/two/:id", (req, res) => {
  const sqlText = `
    UPDATE "user_characters"
  SET "starter_2" = FALSE
    WHERE "user_id" = $1;
      `;

  const sqlValues = [req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      const insertNewUserQuery = `
        UPDATE "user_characters"
          SET "starter_2" = TRUE
          WHERE "id" = $1 AND "user_id" = $2;
          `;

      const sqlValues = [req.params.id, req.user.id];

      pool.query(insertNewUserQuery, sqlValues).then((result) => {
        res.sendStatus(201);
      });
    })
    .catch((err) => {
      // catch for second query
      console.log("in the second", err);
      res.sendStatus(500);
    })
    .catch((err) => {
      console.log("Error in character.router /starter 2 PUT,", err);
      res.sendStatus(500);
    });
});

router.put("/new/:id", (req, res) => {
  const sqlText = `
    UPDATE "user_characters"
    SET "new" = FALSE
    WHERE "id" = $1 AND "user_id" = $2;
          `;

  const insertValue = [req.params.id, req.user.id];

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

router.put("/starter/clear/:id", (req, res) => {
  // console.log(req.params.id);
  const sqlText = `
    UPDATE "user_characters"
        SET "starter_1" = FALSE 
            WHERE "id" = $1 AND "user_id" = $2;
    `;

  const sqlValues = [req.params.id, req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      const sqlText = `
    UPDATE "user_characters"
        SET "starter_2" = FALSE
            WHERE "id" = $1 AND "user_id" = $2;
    `;

      const sqlValues = [req.params.id, req.user.id];

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

router.put("/starter/conditional/:id", (req, res) => {
  //  console.log('req.body', req.body);

  const sqlText = `
    UPDATE "user_characters"
       SET "starter_${req.body.otherStarter}" = FALSE
         WHERE "id" = $1 AND "user_id" = $2;
      `;

  const sqlValues = [req.params.id, req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      const insertNewUserQuery = `
        UPDATE "user_characters"
          SET "starter_${req.body.currentStarter}" = FALSE
          WHERE "user_id" = $1;
          `;

      const sqlValues = [req.user.id];

      pool
        .query(insertNewUserQuery, sqlValues)
        .then((result) => {
          const insertNewUserQuery = `
            UPDATE "user_characters"
              SET "starter_${req.body.currentStarter}" = TRUE
              WHERE "id" = $1 AND "user_id" = $2;
              `;

          const sqlValues = [req.params.id, req.user.id];

          pool.query(insertNewUserQuery, sqlValues).then((result) => {
            res.sendStatus(201);
          });
        })
        .catch((err) => {
          // catch for second query
          console.log("in the third", err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      // catch for second query
      console.log("in the second", err);
      res.sendStatus(500);
    })
    .catch((err) => {
      console.log("Error in character.router /starter conditionally PUT,", err);
      res.sendStatus(500);
    });
});

router.put("/starter/switch", (req, res) => {
  // console.log('req.body',req.body);
  const sqlText = `
 UPDATE "user_characters"
    SET "starter_1" = FALSE, "starter_2" = TRUE
    WHERE "id" = $1 AND "user_id" = $2;
    `;

  const sqlValues = [req.body.starterOneId, req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      const sqlText = `
     UPDATE "user_characters"
    SET "starter_2" = FALSE, "starter_1" = TRUE
    WHERE "id" = $1 AND "user_id" = $2;
    `;

      const sqlValues = [req.body.starterTwoId, req.user.id];

      pool.query(sqlText, sqlValues).then((result) => {
        res.sendStatus(201);
      });
    })
    .catch((err) => {
      console.log("Error in 2nd character.router /starter/switch PUT,", err);
      res.sendStatus(500);
    })
    .catch((err) => {
      console.log("Error in character.router /starter/switch PUT,", err);
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

module.exports = router;
