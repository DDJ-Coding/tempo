import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface MessageDisplayProps {
  messages: Message[];
  currentUserId: string;
  className?: string;
  maxHeight?: string;
  emptyMessage?: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  messages = [],
  currentUserId,
  className,
  maxHeight = "300px",
  emptyMessage = "No messages to display",
}) => {
  if (messages.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <ScrollArea
      className={cn("w-full overflow-y-auto", className)}
      style={{ maxHeight }}
      type="always"
    >
      <div className="space-y-4 p-4">
        {messages.map((message) => {
          const isOutgoing = message.senderId === currentUserId;

          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                isOutgoing ? "justify-end" : "justify-start",
              )}
            >
              {!isOutgoing && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage
                    src={message.senderAvatar}
                    alt={message.senderName}
                  />
                  <AvatarFallback>
                    {message.senderName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-lg p-3 max-w-[80%]",
                  isOutgoing
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted",
                )}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="font-medium text-sm">
                    {isOutgoing ? "You" : message.senderName}
                  </span>
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-1 break-words">{message.content}</p>
              </div>
              {isOutgoing && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage
                    src={message.senderAvatar}
                    alt={message.senderName}
                  />
                  <AvatarFallback>
                    {message.senderName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default MessageDisplay;
