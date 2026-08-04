CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`created_at` text NOT NULL
);
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
