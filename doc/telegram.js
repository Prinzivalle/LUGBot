/**
 * This object represents a Telegram user or bot
 * @typedef {object} User
 * @property {number} id - Unique identifier for this user or bot
 * @property {String} first_name - User‘s or bot’s first name
 * @property {String} last_name - Optional. User‘s or bot’s last name
 * @property {String} username - Optional. User‘s or bot’s username
 */

/**
 * This object represents a chat.
 * @typedef {object} Chat
 * @property {number} id - Unique identifier for this chat. This number may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier.
 * @property {String} type - Type of chat, can be either “private”, “group”, “supergroup” or “channel”
 * @property {String} title - Optional. Title, for supergroups, channels and group chats
 * @property {String} username - Optional. Username, for private chats, supergroups and channels if available
 * @property {String} first_name - Optional. First name of the other party in a private chat
 * @property {String} last_name - Optional. Last name of the other party in a private chat
 * @property {Boolean} all_members_are_administrators - Optional. True if a group has ‘All Members Are Admins’ enabled.
 */

/**
 * This object represents a message.
 * @typedef {object} Message
 * @property {Integer} message_id - Unique message identifier inside this chat
 * @property {User} from - Optional. Sender, can be empty for messages sent to channels
 * @property {Integer} date - Date the message was sent in Unix time
 * @property {Chat} chat - Conversation the message belongs to
 * @property {User} forward_from - Optional. For forwarded messages, sender of the original message
 * @property {Chat} forward_from_chat - Optional. For messages forwarded from a channel, information about the original channel
 * @property {Integer} forward_from_message_id - Optional. For forwarded channel posts, identifier of the original message in the channel
 * @property {Integer} forward_date - Optional. For forwarded messages, date the original message was sent in Unix time
 * @property {Message} reply_to_message - Optional. For replies, the original message. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply.
 * @property {Integer} edit_date - Optional. Date the message was last edited in Unix time
 * @property {String} text - Optional. For text messages, the actual UTF-8 text of the message, 0-4096 characters.
 * @property {MessageEntity[]} entities -  Optional. For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text
 * @property {Audio} audio - Optional. Message is an audio file, information about the file
 * @property {Document} document - Optional. Message is a general file, information about the file
 * @property {Game} game - Optional. Message is a game, information about the game. More about games »
 * @property {PhotoSize[]} photo - Optional. Message is a photo, available sizes of the photo
 * @property {Sticker} sticker - Optional. Message is a sticker, information about the sticker
 * @property {Video} video - Optional. Message is a video, information about the video
 * @property {Voice} voice - Optional. Message is a voice message, information about the file
 * @property {String} caption - Optional. Caption for the document, photo or video, 0-200 characters
 * @property {Contact} contact - Optional. Message is a shared contact, information about the contact
 * @property {Location} location - Optional. Message is a shared location, information about the location
 * @property {Venue} venue - Optional. Message is a venue, information about the venue
 * @property {User} new_chat_member - Optional. A new member was added to the group, information about them (this member may be the bot itself)
 * @property {User} left_chat_member - Optional. A member was removed from the group, information about them (this member may be the bot itself)
 * @property {String} new_chat_title - Optional. A chat title was changed to this value
 * @property {PhotoSize[]} new_chat_photo - Optional. A chat photo was change to this value
 * @property {True} delete_chat_photo - Optional. Service message: the chat photo was deleted
 * @property {True} group_chat_created - Optional. Service message: the group has been created
 * @property {True} supergroup_chat_created - Optional. Service message: the supergroup has been created. This field can‘t be received in a message coming through updates, because bot can’t be a member of a supergroup when it is created. It can only be found in reply_to_message if someone replies to a very first message in a directly created supergroup.
 * @property {True} channel_chat_created - Optional. Service message: the channel has been created. This field can‘t be received in a message coming through updates, because bot can’t be a member of a channel when it is created. It can only be found in reply_to_message if someone replies to a very first message in a channel.
 * @property {Integer} migrate_to_chat_id - Optional. The group has been migrated to a supergroup with the specified identifier. This number may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier.
 * @property {Integer} migrate_from_chat_id - Optional. The supergroup has been migrated from a group with the specified identifier. This number may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier.
 * @property {Message} pinned_message - Optional. Specified message was pinned. Note that the Message object in this field will not contain further reply_to_message fields even if it is itself a reply.
 */
