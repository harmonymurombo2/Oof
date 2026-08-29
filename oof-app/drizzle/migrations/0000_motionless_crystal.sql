CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`receipt_id` text NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`matched_price` real,
	`matched_store` text,
	`email_sent` integer DEFAULT 0,
	FOREIGN KEY (`receipt_id`) REFERENCES `receipts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `receipts` (
	`id` text PRIMARY KEY NOT NULL,
	`store_name` text NOT NULL,
	`purchase_date` text NOT NULL,
	`photo_uri` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`flyer_url` text NOT NULL,
	`customer_email` text NOT NULL,
	`is_active` integer DEFAULT 1
);
