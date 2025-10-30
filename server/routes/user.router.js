const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post("/register", (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = `INSERT INTO "user" (username, password)
    VALUES ($1, $2) RETURNING id`;
  pool
    .query(queryText, [username, password])

    // new stuff to add basic character to new user
    .then((result) => {
      // ID IS HERE!
      // console.log('New user Id:', result.rows[0].id);
      const createdUserId = result.rows[0].id;

      const insertNewUserQuery = `
        INSERT INTO "user_characters" 
          ("user_id", "character_id", "starter_1", "current_hp", "current_stamina", "max_hp", "max_stamina", "xp_level")
          VALUES
          ($1, 1, TRUE, 130, 90, 130, 90, 5) 
          RETURNING user_id;
      `;
      const insertNewUserValues = [createdUserId];

      pool
        .query(insertNewUserQuery, insertNewUserValues)
        .then((result) => {
          // ID IS HERE!
      // console.log('New character Id:', result.rows[0].id);
      const createdUserCharacterId = result.rows[0].id;

      const insertNewUserQuery = `
        INSERT INTO "user_character_attacks"
          ("user_character_id", "attack_id")
          VALUES
            ($1, 1),
            ($1, 2),
            ($1, 3);
      `;
      const insertNewUserValues = [createdUserCharacterId];

      pool
        .query(insertNewUserQuery, insertNewUserValues)
        .then((result) => {
          // ID IS HERE!
          // console.log('New user Id:', result.rows[0].user_id);
          const createdUserId = result.rows[0].user_id;


          const insertNewUserQuery = `
          INSERT INTO "user_inventory" 
            ("user_id", "items_id", "number")
            VALUES
            ($1, 1, 5),
            ($1, 2, 0),
            ($1, 3, 0),
            ($1, 4, 0),
            ($1, 5, 0),
            ($1, 6, 0),
            ($1, 7, 0),
            ($1, 8, 0),
            ($1, 9, 0),
            ($1, 10, 0),
            ($1, 11, 0),
            ($1, 12, 0),
            ($1, 13, 0),
            ($1, 14, 0),
            ($1, 15, 0),
            ($1, 16, 0),
            ($1, 17, 0),
            ($1, 18, 0),
            ($1, 19, 0)
            RETURNING user_id;;
        `;
          const insertNewUserValues = [createdUserId];

          pool
            .query(insertNewUserQuery, insertNewUserValues)
            .then((result) => {
              // ID IS HERE!
              // console.log('New user Id:', result.rows[0].user_id);
              const createdUserId = result.rows[0].user_id;

              const insertNewUserQuery = `
            INSERT INTO "user_rewards" 
              ("user_id", "reward_id", "number")
              VALUES
              ($1, 1, 1),
              ($1, 2, 0),
              ($1, 3, 0),
              ($1, 4, 0)
              RETURNING user_id;
          `;
              const insertNewUserValues = [createdUserId];

              pool
                .query(insertNewUserQuery, insertNewUserValues)
                .then((result) => {
                  // ID IS HERE!
                  // console.log('New user Id:', result.rows[0].user_id);
                  const createdUserId = result.rows[0].user_id;

                  const insertNewUserQuery = `
            INSERT INTO "user_chests" 
              ("user_id", "chest_id")
              VALUES
              ($1, 1),
              ($1, 2),
              ($1, 3),
              ($1, 4),
              ($1, 5),
              ($1, 6),
              ($1, 7),
              ($1, 8),
              ($1, 9),
              ($1, 10),
              ($1, 11);
          `;
                  const insertNewUserValues = [createdUserId];

                  pool
                    .query(insertNewUserQuery, insertNewUserValues)
                    // was here for basic
                    .then(() => {
                      const getUserQuery = `SELECT * FROM "user" WHERE id = $1`;
                      pool
                        .query(getUserQuery, [createdUserId])
                        .then((result) => {
                          const user = result.rows[0];

                          req.login(user, (err) => {
                            if (err) {
                              console.error("Login error after register:", err);
                              return res.sendStatus(500);
                            }

                            res.status(201).json({
                              message: "User registered and logged in",
                              user,
                            });
                          });
                        });
                    })
                    .catch((err) => {
                      console.error("Error fetching user for login:", err);
                      res.sendStatus(500);
                    });
                });
            })
            .catch((err) => {
              // catch for fith query
              console.log(err);
              res.sendStatus(500);
            });
        })
            .catch((err) => {
              // catch for forth query
              console.log(err);
              res.sendStatus(500);
            });
        })
        .catch((err) => {
          // catch for third query
          console.log(err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      // catch for second query
      console.log(err);
      res.sendStatus(500);
    })
    // for the first query
    .catch((err) => {
      console.log("User registration failed: ", err);
      res.sendStatus(500);
    });
});

// router.post("/register", (req, res, next) => {
//   const username = req.body.username;
//   const password = encryptLib.encryptPassword(req.body.password);

//   const queryText = `
//     INSERT INTO "user"
//       (username, password)
//       VALUES ($1, $2)
//       RETURNING id;
//   `;

//   pool
//     .query(queryText, [username, password])
//     .then((result) => {
//       const createdUserId = result.rows[0].id;

//       const insertUserCharacterQuery = `
//         INSERT INTO "user_characters"
//           ("user_id", "character_id", "starter_1", "current_hp", "current_stamina", "max_hp", "max_stamina", "xp_level")
//         VALUES
//           ($1, 1, TRUE, 130, 90, 130, 90, 5)
//         RETURNING id;  -- RETURN user_character_id
//       `;

//       return pool
//         .query(insertUserCharacterQuery, [createdUserId])
//         .then((charResult) => {
//           const createdUserCharacterId = charResult.rows[0].id;

//           const insertAttacksQuery = `
//           INSERT INTO "user_character_attacks"
//           ("user_character_id", "attack_id")
//           VALUES
//             ($1, 1),
//             ($1, 2),
//             ($1, 3);
//         `;

//           return pool
//             .query(insertAttacksQuery, [createdUserCharacterId])
//             .then(() => {
//               const insertInventoryQuery = `
//             INSERT INTO "user_inventory"
//             ("user_id", "items_id", "number")
//             VALUES
//               ($1, 1, 5),
//               ($1, 2, 0),
//               ($1, 3, 0),
//               ($1, 4, 0),
//               ($1, 5, 0),
//               ($1, 6, 0),
//               ($1, 7, 0),
//               ($1, 8, 0),
//               ($1, 9, 0),
//               ($1, 10, 0),
//               ($1, 11, 0),
//               ($1, 12, 0),
//               ($1, 13, 0),
//               ($1, 14, 0),
//               ($1, 15, 0),
//               ($1, 16, 0),
//               ($1, 17, 0),
//               ($1, 18, 0),
//               ($1, 19, 0)
//             RETURNING user_id;
//           `;
//               return pool.query(insertInventoryQuery, [createdUserId]);
//             });
//         });
//     })
//     .then((result) => {
//       const createdUserId = result.rows[0].user_id;

//       const insertRewardsQuery = `
//         INSERT INTO "user_rewards"
//         ("user_id", "reward_id", "number")
//         VALUES
//           ($1, 1, 1),
//           ($1, 2, 0),
//           ($1, 3, 0),
//           ($1, 4, 0)
//         RETURNING user_id;
//       `;
//       return pool.query(insertRewardsQuery, [createdUserId]);
//     })
//     .then((result) => {
//       const createdUserId = result.rows[0].user_id;

//       const insertChestsQuery = `
//         INSERT INTO "user_chests"
//         ("user_id", "chest_id")
//         VALUES
//           ($1, 1),
//           ($1, 2),
//           ($1, 3),
//           ($1, 4),
//           ($1, 5),
//           ($1, 6),
//           ($1, 7),
//           ($1, 8),
//           ($1, 9),
//           ($1, 10),
//           ($1, 11);
//       `;
//       return pool.query(insertChestsQuery, [createdUserId]);
//     })
//     .then((result) => {
//       const createdUserId = result.rows[0].user_id;
//       const getUserQuery = `SELECT * FROM "user" WHERE id = $1`;

//       pool.query(getUserQuery, [createdUserId]).then((userResult) => {
//         const user = userResult.rows[0];

//         req.login(user, (err) => {
//           if (err) {
//             console.error("Login error after register:", err);
//             return res.sendStatus(500);
//           }

//           res.status(201).json({
//             message: "User registered and logged in",
//             user,
//           });
//         });
//       });
//     })
//     .catch((err) => {
//       console.error("Registration error:", err);
//       res.sendStatus(500);
//     });
// });

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post("/login", userStrategy.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post("/logout", (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

router.use(rejectUnauthenticated);

router.get("/rewards", (req, res) => {
  const query = `
  SELECT "user_rewards"."id" as "id",
  "user_rewards"."user_id" as "user_id",
  "user_rewards"."reward_id" as "reward_id",
  "user_rewards"."number" as "number",
  "rewards"."reward_name",
  "rewards"."pic"
FROM "user_rewards"
INNER JOIN "rewards"
ON "user_rewards"."reward_id" = "rewards"."id"
WHERE "user_id" = $1 AND "user_rewards"."number" > 0;
`;

  const sqlValues = [req.user.id];

  pool
    .query(query, sqlValues)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all rewards for user", err);
      res.sendStatus(500);
    });
});

router.get("/all/rewards", (req, res) => {
  const query = `
  SELECT "id",
  "reward_name",
  "pic",
  "cost"
FROM "rewards";
`;

  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all rewards", err);
      res.sendStatus(500);
    });
});

router.get("/chests", (req, res) => {
  const query = `
  SELECT "user_chests"."id" as "id",
  "user_chests"."user_id" as "user_id",
  "user_chests"."chest_id" as "chest_id",
  "user_chests"."is_opened",
  "chests"."world_name",
  "chests"."x" as "chest_x",
  "chests"."y" as "chest_y"
FROM "user_chests"
INNER JOIN "chests"
ON "user_chests"."chest_id" = "chests"."id"
WHERE "user_id" = $1;
`;

  const sqlValues = [req.user.id];

  pool
    .query(query, sqlValues)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get chests for user", err);
      res.sendStatus(500);
    });
});

router.put("/change", (req, res) => {
  // console.log('req.body', req.body.newName);
  const sqlText = `
  UPDATE "user"
    SET "username" = ($1)
    WHERE "id" = $2;
    `;

  const sqlValues = [req.body.newName, req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error in user.router PUT changing name,", err);
      res.sendStatus(500);
    });
});

router.delete("/", (req, res) => {
  const sqlText = `
    DELETE FROM "user_inventory"
      WHERE "user_id" = $1;
      `;

  const sqlValues = [req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      // Now handle the user_characters reference:
      const insertNewUserQuery = `
      DELETE FROM "user_characters"
        WHERE "user_id" = $1;
        `;

      const sqlValues = [req.user.id];

      // SECOND QUERY DELETES user_id from user_characeters
      pool
        .query(insertNewUserQuery, sqlValues)
        .then((result) => {
          // Now handle the user_characters reference:
          const insertNewUserQuery = `
        DELETE FROM "user"
          WHERE "id" = $1;`;

          const sqlValues = [req.user.id];

          // Third QUERY DELETES user from user table
          pool
            .query(insertNewUserQuery, sqlValues)

            // was here for basic
            .then((result) => {
              res.sendStatus(201);
            });
        })
        .catch((err) => {
          // catch for third query
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
      console.log("Error in user.router DELETE, deleting account", err);
      res.sendStatus(500);
    });
});

router.put("/won/battle", (req, res) => {
  const newUserXpLevel = Number(req.user.xp_level) + req.body.xp;
  let rewardId;
  let sqlText;

  if (Math.floor(Number(newUserXpLevel)) % 4 === 0) rewardId = 4;
  else if (Math.floor(Number(newUserXpLevel)) % 3 === 0) rewardId = 3;
  else if (Math.floor(Number(newUserXpLevel)) % 2 === 0) rewardId = 2;
  else rewardId = 1;

  if (Math.floor(newUserXpLevel) > req.user.rewards_received) {
    // if (Math.floor(newUserXpLevel) > 1) {
    sqlText = `
                UPDATE "user_rewards"
                      SET "number" = "number" + 1
                      WHERE "user_id" = $1 AND "reward_id" = $2;
              `;
  } else {
    sqlText = `
                UPDATE "user_rewards"
                      SET "number" = "number"
                      WHERE "user_id" = $1 AND "reward_id" = $2;
              `;
  }

  const sqlValues = [req.user.id, rewardId];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      let sqlText;

      if (
        Math.floor(Number(req.user.xp_level) + req.body.xp) >
        req.user.rewards_received
      ) {
        // if (Math.floor(1.75 + req.body.xp) > 1) {
        sqlText = `
    UPDATE "user"
          SET "coins" = "coins" + 10, "xp_level" = "xp_level" + $1,  "rewards_received" = "rewards_received" + 1
          WHERE "id" = $2;
      `;
      } else {
        sqlText = `
    UPDATE "user"
          SET "coins" = "coins" + 10, "xp_level" = "xp_level" + $1
          WHERE "id" = $2;
      `;
      }

      const sqlValues = [req.body.xp, req.user.id];

      pool
        .query(sqlText, sqlValues)
        .then((result) => {
          let starterLevel = Math.floor(Number(req.body.winningStarter.level));
          let newStarterLevel =
            Number(req.body.characterXp) +
            Number(req.body.winningStarter.level);

          let sqlText;
          let sqlValues;

          const multiplier = Math.floor(newStarterLevel) / 5;

          const baseHp = req.body.winningStarter.base_hp * multiplier;
          const baseStamina = req.body.winningStarter.base_stamina * multiplier;
          const itemHp = req.body.winningStarter.item.item_hp || 0;
          const itemStamina = req.body.winningStarter.item.item_stamina || 0;

          const newMaxHp = baseHp + itemHp;
          const newMaxStamina = baseStamina + itemStamina;

          if (
            Math.floor(
              Number(req.body.characterXp) +
                Number(req.body.winningStarter.level)
            ) > starterLevel
          ) {
            sqlText = `
          UPDATE "user_characters"
            SET "xp_level" = "xp_level" + $1, "current_hp" = $2, "current_stamina" = $3, "max_hp" = $2, "max_stamina" = $3
            WHERE "user_id" = $4 AND "id" = $5;
      `;

            sqlValues = [
              req.body.characterXp,
              Math.round(newMaxHp),
              Math.round(newMaxStamina),
              req.user.id,
              req.body.winningStarter.currentStarterId,
            ];
          } else {
            sqlText = `
          UPDATE "user_characters"
            SET "xp_level" = "xp_level" + $1, "current_hp" = $2, "current_stamina" = $3
            WHERE "user_id" = $4 AND "id" = $5;
      `;

            sqlValues = [
              req.body.characterXp,
              Math.round(req.body.winningStarter.current_hp),
              Math.round(req.body.winningStarter.current_stamina),
              req.user.id,
              req.body.winningStarter.currentStarterId,
            ];
          }

          pool
            .query(sqlText, sqlValues)
            .then((result) => {
              res.sendStatus(201);
            })
            .catch((err) => {
              console.log("Error in user.router /won/battle PUT,", err);
              res.sendStatus(500);
            });
        })
        .catch((err) => {
          console.log("Error in user.router /won/battle PUT,", err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log("Error in user.router /won/battle PUT,", err);
      res.sendStatus(500);
    });
});

router.put("/credits", (req, res) => {
  // console.log('are we here?');
  const sqlText = `
  UPDATE "user"
    SET "credit_video_completed" = true, "coins" = "coins" + 15
    WHERE "id" = $1;
    `;

  const sqlValues = [req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error in user.router PUT changing credits to true,", err);
      res.sendStatus(500);
    });
});

router.put("/reward/open", (req, res) => {
  // console.log('are we here?');
  const sqlText = `
      UPDATE "user_rewards"
        SET "number" = "number" - 1
          WHERE "reward_id" = $1 AND "user_id" = $2
    `;

  const sqlValues = [req.body.rewardId, req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error in user.router /reward/open PUT,", err);
      res.sendStatus(500);
    });
});

router.put("/chest/open", (req, res) => {
  // console.log('req.body', req.body);

  const sqlText = `
        UPDATE "user_chests"
          SET "is_opened" = TRUE
            WHERE "user_id" = $1 AND "chest_id" = $2;
    `;

  const sqlValues = [req.user.id, req.body.chestId];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      const sqlText = `
        UPDATE "user_inventory"
          SET "number" = "number" + 1
            WHERE "user_id" = $1 AND "items_id" = $2;
      `;

      const sqlValues = [req.user.id, req.body.itemId];

      pool.query(sqlText, sqlValues).then((result) => {
        res.sendStatus(201);
      });
    })
    .catch((err) => {
      // catch for second query
      console.log("in the second", err);
      res.sendStatus(500);
    })
    .catch((err) => {
      console.log("Error in user.router /chest/open PUT,", err);
      res.sendStatus(500);
    });
});

module.exports = router;
