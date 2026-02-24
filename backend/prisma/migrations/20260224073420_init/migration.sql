-- CreateTable
CREATE TABLE "accounts" (
    "account_id" UUID NOT NULL,
    "clerk_id" TEXT,
    "email" TEXT,
    "username" TEXT,
    "display_pic" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "user_chats" (
    "chat_id" UUID NOT NULL,
    "user1_id" UUID NOT NULL,
    "user2_id" UUID NOT NULL,
    "user1_archived" BOOLEAN NOT NULL DEFAULT false,
    "user2_archived" BOOLEAN NOT NULL DEFAULT false,
    "user1_last_read_at" TIMESTAMP(3),
    "user2_last_read_at" TIMESTAMP(3),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_chats_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "message_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "text_content" TEXT NOT NULL,
    "media" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "links" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "docs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "user_chat_id" UUID,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_clerk_id_key" ON "accounts"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_username_key" ON "accounts"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_chats_user1_id_user2_id_key" ON "user_chats"("user1_id", "user2_id");

-- AddForeignKey
ALTER TABLE "user_chats" ADD CONSTRAINT "user_chats_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_chats" ADD CONSTRAINT "user_chats_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_chat_id_fkey" FOREIGN KEY ("user_chat_id") REFERENCES "user_chats"("chat_id") ON DELETE CASCADE ON UPDATE CASCADE;
