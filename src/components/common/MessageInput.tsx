import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  recipients?: Array<{
    id: string;
    name: string;
  }>;
  onSendMessage: (recipientId: string, message: string) => void;
  className?: string;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  recipients = [],
  onSendMessage,
  className,
  placeholder = "Type your message here...",
}) => {
  const [message, setMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");

  const handleSendMessage = () => {
    if (message.trim() && selectedRecipient) {
      onSendMessage(selectedRecipient, message);
      setMessage("");
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {recipients.length > 0 && (
        <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select recipient" />
          </SelectTrigger>
          <SelectContent>
            {recipients.map((recipient) => (
              <SelectItem key={recipient.id} value={recipient.id}>
                {recipient.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-h-[100px] resize-none"
        />
      </div>
      <Button
        onClick={handleSendMessage}
        disabled={!message.trim() || !selectedRecipient}
        className="w-full"
      >
        <Send className="mr-2 h-4 w-4" /> Send Message
      </Button>
    </div>
  );
};

export default MessageInput;
