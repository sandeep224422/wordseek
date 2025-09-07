import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const gamesTable = pgTable("games", {
  id: serial("id").primaryKey(),
  word: varchar("word", { length: 5 }).notNull(),
  activeChat: text("active_chat").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export const guessesTable = pgTable("guesses", {
  id: serial("id").primaryKey(),
  guess: varchar("guess", { length: 5 }).notNull(),
  gameId: integer("game_id")
    .notNull()
    .references(() => gamesTable.id, { onDelete: "cascade" }),
  chatId: varchar("chat_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }),
  telegramUserId: varchar("telegram_user_id").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export const leaderboardTable = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => usersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  chatId: varchar("chat_id").notNull(),
  score: integer("score").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export const bannedUsersTable = pgTable("banned_users", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => usersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export const gamesRelations = relations(gamesTable, ({ many }) => ({
  guesses: many(guessesTable),
}));

export const guessesRelations = relations(guessesTable, ({ one }) => ({
  game: one(gamesTable, {
    fields: [guessesTable.gameId],
    references: [gamesTable.id],
  }),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
  leaderboard: many(leaderboardTable),
}));

export const leaderboardRelations = relations(leaderboardTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [leaderboardTable.userId],
    references: [usersTable.id],
  }),
}));
